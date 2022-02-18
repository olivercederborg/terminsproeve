import clsx from 'clsx'
import { InputHTMLAttributes } from 'react'
import { useField } from 'remix-validated-form'

type InputProps = {
	name: string
} & InputHTMLAttributes<HTMLInputElement>

export const Input = ({ name, className, ...rest }: InputProps) => {
	const { error, getInputProps } = useField(name)
	return (
		<>
			<input
				{...getInputProps({ id: name })}
				className={clsx(error && 'border-red-500 border', className)}
				{...rest}
			/>
			{error && (
				<div className='text-red-500 bg-light-gray p-2 border-red-500 border mt-1 text-sm'>
					{error}
				</div>
			)}
		</>
	)
}
