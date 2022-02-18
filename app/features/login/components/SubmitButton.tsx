import { useIsSubmitting } from 'remix-validated-form'

export const SubmitButton = () => {
	const isSubmitting = useIsSubmitting()

	return (
		<button
			type='submit'
			className='py-4 bg-dark-purple px-20 mx-auto rounded-[10px] mt-4 text-white shadow-[3px_4px_4px_0_rgba(0,0,0,0.25)]'
		>
			{isSubmitting ? 'Logger ind...' : 'Login'}
		</button>
	)
}
