import { FC } from 'react'
import { Link } from 'remix'
import { Activity } from '~/features/activities/types'

type ActivityCardProps = {
	activity: Activity
}

const ActivityCard: FC<ActivityCardProps> = ({ activity }) => {
	return (
		<Link
			to={`/activities/${activity.id}`}
			className='rounded-[39px_39px_0_39px] overflow-hidden aspect-[89/86] relative'
		>
			<img src={activity.asset.url} alt={activity.name} className='object-cover h-full w-full' />
			<article className='bg-light-pink/80 text-black absolute bottom-0 inset-x-0 p-6 rounded-tr-[39px]'>
				<h2>{activity.name}</h2>
				<p>
					{activity.minAge}-{activity.maxAge} år
				</p>
			</article>
		</Link>
	)
}
export default ActivityCard
