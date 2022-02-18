import { Fragment } from 'react'
import { json, LoaderFunction, useLoaderData } from 'remix'
import ActivityCard from '~/components/ActivityCard'
import Nav from '~/components/Nav'
import type { Activity } from '~/features/activities/types'

type LoaderData = {
	activities: Activity[]
}

export const loader: LoaderFunction = async ({ request }) => {
	const activities = await fetch('http://localhost:4000/api/v1/activities')

	return json({
		activities: await activities.json(),
	})
}

const Activities = () => {
	const { activities } = useLoaderData<LoaderData>()
	return (
		<Fragment>
			<Nav />
			<main className='px-7 text-light-gray pt-8 pb-24 bg-dark-purple min-h-screen'>
				<h1 className='text-4xl'>Aktiviteter</h1>
				<section className='mt-8 flex flex-col gap-y-8'>
					{activities.map(activity => (
						<ActivityCard key={activity.id} activity={activity} />
					))}
				</section>
			</main>
		</Fragment>
	)
}
export default Activities
