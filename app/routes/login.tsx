import { ActionFunction, Form, json, LoaderFunction, redirect } from 'remix'
import { commitSession, getSession } from '~/features/login/utils/sessions.server'

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
	const form = await request.formData()
	try {
		const token = await fetch('http://localhost:4000/auth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: form.get('username'),
				password: form.get('password'),
			}),
		})

		const { token: authToken, userId } = await token.json()

		if (token.ok) {
			const shouldKeepLoggedIn = form.get('keep-logged-in') === 'on'
			const session = await getSession(request.headers.get('Cookie'))
			session.set('access_token', authToken)
			session.set('user_id', userId)
			shouldKeepLoggedIn && session.set('keep_logged_in', true)

			return redirect('/', {
				headers: {
					'Set-Cookie': await commitSession(session),
				},
			})
		}
		return redirect('/activities')
	} catch (error: unknown) {
		return redirect('/login', 400)
	}
}

const Login = () => (
	<main className='bg-welcome-image h-screen bg-cover bg-no-repeat bg-center relative overflow-hidden flex flex-col justify-center'>
		<div className='absolute bg-dark-purple/50 h-[479px] w-[1000px] my-auto -rotate-[30deg] inset-y-0 -translate-x-[33%]' />
		<section className='z-10'>
			<h1 className='text-5xl ml-12 mr-8 text-light-gray'>Log ind</h1>
			<Form method='post' className='flex flex-col'>
				<input
					type='text'
					placeholder='brugernavn'
					name='username'
					className='mt-2.5 py-3.5 px-6 ml-12 mr-8'
				/>
				<input
					type='password'
					placeholder='adgangskode'
					name='password'
					className='mt-3.5 py-3.5 px-6 ml-12 mr-8'
				/>
				<fieldset className='mt-3.5 py-3.5 px-6 ml-12 mr-8 flex justify-between'>
					<label htmlFor='keep-logged-in' className='text-white'>
						Husk mig
					</label>
					<input type='checkbox' name='keep-logged-in' id='keep-logged-in' />
				</fieldset>
				<button
					type='submit'
					className='py-4 bg-dark-purple px-20 mx-auto rounded-[10px] mt-[30px] text-white shadow-[3px_4px_4px_0_rgba(0,0,0,0.25)]'
				>
					Log ind
				</button>
			</Form>
		</section>
	</main>
)

export default Login
