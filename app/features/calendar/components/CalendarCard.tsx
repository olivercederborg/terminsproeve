import { FC } from 'react'
import { Link } from 'remix'
import { Activity } from '~/features/activities/types'

type CalendarCardProps = {
	activity: Activity
	isInstructor?: boolean
}

const CalendarCard: FC<CalendarCardProps> = ({ activity, isInstructor }) => {
	return (
		<Link to={isInstructor ? `/calendar/${activity.id}` : `/activities/${activity.id}`}>
			<article className='bg-light-gray px-8 py-6 text-black rounded-[11px]'>
				<h2 className='text-4xl truncate'>{activity.name}</h2>
				<p>
					{activity.weekday} {activity.time}
				</p>
			</article>
		</Link>
	)
}
export default CalendarCard
