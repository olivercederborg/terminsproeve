import { ActionFunction, Form, json, LoaderFunction, redirect, useActionData } from 'remix'
import { commitSession, getSession } from '~/features/login/utils/sessions.server'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'
import { Input } from '~/features/login/components/Input'
import { SubmitButton } from '~/features/login/components/SubmitButton'

export const validator = withZod(
	z.object({
		username: z.string().nonempty('Bruger navn skal udfyldes'),
		password: z.string().nonempty('Adgangskode skal udfyldes'),
		keeploggedin: z.enum(['on']).nullable().optional(),
	})
)

export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request.headers.get('Cookie'))

	if (session.has('access_token') && session.has('keep_logged_in')) {
		return redirect('/activities')
	}

	const data = { error: session.get('error') }

	return json(data, {
		headers: {
			'Set-Cookie': await commitSession(session),
		},
	})
}

export const action: ActionFunction = async ({ request }) => {
	const data = await validator.validate(await request.formData())
	if (data.error) return validationError(data.error)
	const { username, password, keeploggedin } = data.data
	try {
		const token = await fetch('http://localhost:4000/auth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username,
				password,
			}),
		})

		const { token: authToken, userId } = await token.json()

		if (token.ok) {
			const shouldKeepLoggedIn = keeploggedin === 'on'
			const session = await getSession(request.headers.get('Cookie'))
			session.set('access_token', authToken)
			session.set('user_id', userId)
			shouldKeepLoggedIn && session.set('keep_logged_in', true)

			return redirect('/activities', {
				headers: {
					'Set-Cookie': await commitSession(session),
				},
			})
		}
		return redirect('/activities')
	} catch (error: unknown) {
		return json({ error: 'Forkert login, prøv igen.' })
	}
}

const Login = () => {
	const data = useActionData()
	return (
		<main className='bg-welcome-image h-screen bg-cover bg-no-repeat bg-center relative overflow-hidden flex flex-col justify-center'>
			<div className='absolute bg-dark-purple/50 h-[479px] w-[1000px] my-auto -rotate-[30deg] inset-y-0 -translate-x-[33%]' />
			<section className='z-10'>
				<h1 className='text-5xl ml-12 mr-8 text-light-gray'>Log ind</h1>
				<ValidatedForm validator={validator} method='post' className='flex flex-col'>
					<fieldset className='ml-12 mr-8'>
						<Input
							type='text'
							placeholder='brugernavn'
							name='username'
							className='px-6 py-3.5 mt-2.5 bg-light-gray'
						/>
						<Input
							type='password'
							placeholder='adgangskode'
							name='password'
							className='mt-3.5 py-3.5 px-6 bg-light-gray'
						/>
					</fieldset>
					<fieldset className='mt-3.5 ml-12 mr-8 flex justify-between'>
						<label htmlFor='keeploggedin' className='text-white'>
							Husk mig
						</label>
						<input type='checkbox' name='keeploggedin' id='keeploggedin' />
					</fieldset>
					<SubmitButton />
					{data?.error && (
						<p className='mx-auto mt-4 text-red-500 bg-light-gray p-2 border-red-500 border text-sm'>
							{data.error}
						</p>
					)}
				</ValidatedForm>
			</section>
		</main>
	)
}

export default Login
