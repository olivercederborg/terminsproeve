import { Fragment, useEffect } from 'react'
import { json, LoaderFunction, useLoaderData, useNavigate } from 'remix'
import Nav from '~/components/Nav'
import { Activity } from '~/features/activities/types'
import CalendarCard from '~/features/calendar/components/CalendarCard'
import { getSession } from '~/features/login/utils/sessions.server'
import { useUser } from '~/features/login/utils/userContext'

type LoaderData = {
	instructorActivities: Activity[]
}

export const loader: LoaderFunction = async ({ request, params }) => {
	const session = await getSession(request.headers.get('Cookie'))
	const authToken = session.get('access_token')
	const userId = session.get('user_id')

	const res = await fetch(`http://localhost:4000/api/v1/activities`)
	const activities: Activity[] = await res.json()
	const instructorActivities = activities.filter(activity => activity.instructorId === userId)

	return json({ instructorActivities })
}

const Calendar = () => {
	const { instructorActivities } = useLoaderData<LoaderData>()
	const { user } = useUser()
	const navigate = useNavigate()
	const isInstructor = user?.role === 'instructor'
	const noActivities = !instructorActivities.length && !user?.activities.length

	useEffect(() => {
		if (!user) navigate('/login')
	}, [user])
	return (
		<Fragment>
			<Nav />
			<main className='px-7 text-light-gray pt-8 pb-24 bg-dark-purple min-h-screen'>
				<h1 className='text-4xl'>Kalender</h1>
				<section className='mt-8 flex flex-col gap-y-[30px]'>
					{!isInstructor &&
						user?.activities.map(activity => (
							<CalendarCard
								key={activity.id}
								activity={activity}
								isInstructor={isInstructor}
							/>
						))}

					{isInstructor &&
						instructorActivities.map(activity => (
							<CalendarCard
								key={activity.id}
								activity={activity}
								isInstructor={isInstructor}
							/>
						))}

					{noActivities && <h2>Du er ikke tilmeldt nogen aktiviteter.</h2>}
				</section>
			</main>
		</Fragment>
	)
}
export default Calendar
