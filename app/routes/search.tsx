import { ChangeEvent, Fragment, useCallback, useMemo } from 'react'
import {
	ActionFunction,
	Form,
	json,
	LoaderFunction,
	useActionData,
	useLoaderData,
	useSubmit,
} from 'remix'
import debounce from 'lodash.debounce'
import ActivityCard from '~/components/ActivityCard'
import Nav from '~/components/Nav'
import type { Activity } from '~/features/activities/types'

type LoaderData = {
	activities: Activity[]
}

type ActionData = {
	searchActivities: Activity[] | null
}

export const loader: LoaderFunction = async ({ request }) => {
	const activities = await fetch('http://localhost:4000/api/v1/activities')

	return json({
		activities: await activities.json(),
	})
}

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData()
	const query = form.get('query')
	const res = await fetch('http://localhost:4000/api/v1/activities')
	const activities: Activity[] = await res.json()
	const searchActivities = query
		? activities.filter(activity =>
				activity.name.toLowerCase().includes(query?.toString().toLowerCase())
		  )
		: null

	return json({
		searchActivities,
	})
}

const Search = () => {
	const { activities } = useLoaderData<LoaderData>()
	const data = useActionData<ActionData>()
	const submit = useSubmit()

	const onSearch = (event: ChangeEvent<HTMLFormElement>) =>
		submit(event.currentTarget, { replace: true })

	return (
		<Fragment>
			<Nav />
			<main className='px-7 text-light-gray pt-8 pb-24 bg-dark-purple min-h-screen'>
				<h1 className='text-4xl'>Søg</h1>
				<Form method='post' onChange={onSearch}>
					<input
						type='text'
						placeholder='Søg efter aktiviteter'
						name='query'
						className='bg-[#c4c4c446] w-full h-12 px-5 placeholder:text-white/50 mt-4'
					/>
				</Form>

				<section className='mt-8 flex flex-col gap-y-8'>
					{data?.searchActivities
						? data.searchActivities.map(activity => (
								<ActivityCard key={activity.id} activity={activity} />
						  ))
						: activities.map(activity => (
								<ActivityCard key={activity.id} activity={activity} />
						  ))}
				</section>
			</main>
		</Fragment>
	)
}
export default Search
