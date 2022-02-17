import { BiCalendarAlt, BiHomeAlt, BiSearch } from 'react-icons/bi'
import { Link } from 'remix'

const Nav = () => {
	return (
		<nav className='px-7 h-16 fixed bottom-0 flex items-center inset-x-0 bg-light-gray shadow-[0_-3px_4px_0_rgba(0,0,0,0.25)]'>
			<ul className='flex justify-between w-full'>
				<li className='rounded-full border border-black p-1.5'>
					<Link to='/activities'>
						<BiHomeAlt size={24} />
					</Link>
				</li>
				<li className='rounded-full border border-black p-1.5'>
					<Link to='/search'>
						<BiSearch size={24} />
					</Link>
				</li>
				<li className='rounded-full border border-black p-1.5'>
					<Link to='calendar'>
						<BiCalendarAlt size={24} />
					</Link>
				</li>
			</ul>
		</nav>
	)
}
export default Nav
