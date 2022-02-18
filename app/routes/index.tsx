import { motion } from 'framer-motion'
import { Link } from 'remix'

const Index = () => (
	<main className='grid grid-rows-6 bg-welcome-image h-screen bg-cover bg-no-repeat bg-center'>
		<section className='row-start-4'>
			<h1 className='text-4xl flex flex-col ml-11 uppercase -space-y-4'>
				<span
					className='text-transparent font-roboto uppercase'
					style={{ WebkitTextStroke: '2px #431567' }}
				>
					Landrup
				</span>
				<span
					className='text-7xl font-racing text-[#E856EB]'
					style={{ WebkitTextStroke: '1px black' }}
				>
					Dans
				</span>
			</h1>
			<div className='w-[242px] h-[14px] bg-[#913693] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]' />
		</section>

		<motion.div
			initial={{
				opacity: 0,
			}}
			animate={{ opacity: 1, transition: { duration: 0.5, delay: 1.5, ease: 'easeInOut' } }}
			className='row-start-6 self-center mx-auto'
		>
			<Link
				to='/login'
				className='py-4 bg-dark-purple px-20 mx-auto rounded-[10px] text-white shadow-[3px_4px_4px_0_rgba(0,0,0,0.25)]'
			>
				Kom i gang
			</Link>
		</motion.div>
	</main>
)

export default Index
