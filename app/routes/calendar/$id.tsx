import { Fragment, useEffect } from 'react'
import { json, LoaderFunction, redirect, useLoaderData, useNavigate } from 'remix'
import Nav from '~/components/Nav'
import { Activity } from '~/features/activities/types'
import { getSession } from '~/features/login/utils/sessions.server'
import { useUser } from '~/features/login/utils/userContext'

type LoaderData = {
	activityRoster: {
		activity: string
		firstname: string
		lastname: string
		time: string
		weekday: string
	}[]
	activity: Activity
}

export const loader: LoaderFunction = async ({ request, params }) => {
	const session = await getSession(request.headers.get('Cookie'))
	const authToken = session.get('access_token')
	const userId = session.get('user_id')

	if (!authToken) return redirect('/login')
	const activity = await fetch(`http://localhost:4000/api/v1/activities/${params.id}`)
	const res = await fetch(`http://localhost:4000/api/v1/users/${userId}/roster/${params.id}`, {
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	})
	const activityRoster = await res.json()

	return json({ activityRoster, activity: await activity.json() })
}

const Calendar = () => {
	const { activityRoster, activity } = useLoaderData<LoaderData>()
	const { user } = useUser()
	const navigate = useNavigate()
	const hasNoAttendees = activityRoster.length === 0
	const notAllowed =
		user?.role !== 'instructor' ||
		(user.role === 'instructor' && user.id !== activity.instructorId)

	useEffect(() => {
		if (notAllowed) navigate('/calendar')
	}, [user])
	return (
		<Fragment>
			<Nav />
			<main className='px-7 text-light-gray pt-8 pb-24 bg-dark-purple min-h-screen'>
				<h1 className='text-4xl truncate'>{activity.name}</h1>
				<section className='mt-8 flex flex-col gap-y-1'>
					{activityRoster.map(member => (
						<article key={member.firstname + member.lastname}>
							{member.firstname} {member.lastname}
						</article>
					))}
					{hasNoAttendees && <h2>Der er ingen tilmeldt til dette hold.</h2>}
				</section>
			</main>
		</Fragment>
	)
}
export default Calendar
