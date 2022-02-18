import { Fragment, useMemo } from 'react'
import {
	Form,
	json,
	redirect,
	useLoaderData,
	type ActionFunction,
	type LoaderFunction,
} from 'remix'
import Nav from '~/components/Nav'
import type { Activity } from '~/features/activities/types'
import { getDayName } from '~/features/activities/utils/getDayName'
import { getSession } from '~/features/login/utils/sessions.server'
import { useUser } from '~/features/login/utils/userContext'

type LoaderData = {
	activity: Activity
}

export const loader: LoaderFunction = async ({ request, params }) => {
	const activity = await fetch(`http://localhost:4000/api/v1/activities/${params.id}`)

	return json({
		activity: await activity.json(),
	})
}

export const action: ActionFunction = async ({ request, params }) => {
	const form = await request.formData()
	console.log(form)
	const button = form.get('button')
	const session = await getSession(request.headers.get('Cookie'))
	const authToken = session.get('access_token')
	const userId = session.get('user_id')
	try {
		switch (button) {
			case '_action/signup':
				await fetch(`http://localhost:4000/api/v1/users/${userId}/activities/${params.id}`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				})
				redirect(`/activities/${params.id}`)
				break
			case '_action/cancel':
				await fetch(`http://localhost:4000/api/v1/users/${userId}/activities/${params.id}`, {
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				})
				redirect(`/activities/${params.id}`)
				break

			default:
				redirect(`/activities/${params.id}`)
				break
		}
	} catch (error: unknown) {
		return json({
			error: 'Something went wrong',
		})
	}
	return json({
		success: 'Success',
	})
}

const ActivityDetails = () => {
	const { activity } = useLoaderData<LoaderData>()
	const { user } = useUser()
	const isSignedUp = useMemo(
		() => activity.users.some(attendee => attendee.id == user?.id),
		[user, activity]
	)
	const isSameWeekDay = activity.weekday === getDayName('da-DK')
	const isWithinAge = user && user?.age >= activity.minAge && user?.age <= activity.maxAge
	const isInstructor = user?.role === 'instructor'
	return (
		<Fragment>
			<Nav />
			<main className='text-light-gray pb-24 bg-dark-purple min-h-screen'>
				<header
					className='w-full flex flex-col justify-end items-end px-7 py-6 bg-cover aspect-[89/86] bg-center bg-no-repeat'
					style={{ backgroundImage: `url(${activity.asset.url})` }}
				>
					{user && !isSameWeekDay && isWithinAge && !isInstructor && (
						<Form method='post'>
							{isSignedUp ? (
								<button
									type='submit'
									value='_action/cancel'
									name='button'
									className='py-4 bg-dark-purple px-20 rounded-[10px] mt-[30px] text-white shadow-[3px_4px_4px_0_rgba(0,0,0,0.25)]'
								>
									Forlad
								</button>
							) : (
								<button
									type='submit'
									value='_action/signup'
									name='button'
									className='py-4 bg-dark-purple px-20 rounded-[10px] mt-[30px] text-white shadow-[3px_4px_4px_0_rgba(0,0,0,0.25)]'
								>
									Tilmeld
								</button>
							)}
						</Form>
					)}
				</header>

				<article className='px-7 mt-4'>
					<h1 className='text-2xl'>{activity.name}</h1>
					<h2 className='text-4'>
						{activity.minAge}-{activity.maxAge} år
					</h2>

					<p>
						{activity.weekday} {activity.time}
					</p>
					<p className='mt-2.5'>{activity.description}</p>
				</article>
			</main>
		</Fragment>
	)
}
export default ActivityDetails
