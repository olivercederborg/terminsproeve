import { ReactNode } from 'react'
import {
	json,
	Links,
	LinksFunction,
	LiveReload,
	LoaderFunction,
	Meta,
	MetaFunction,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from 'remix'
import { getSession } from '~/features/login/utils/sessions.server'
import { UserProvider, type User } from '~/features/login/utils/userContext'
import styles from './styles/tailwind.css'

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: styles },
		{
			rel: 'preconnect',
			href: 'https://fonts.googleapis.com',
		},
		{
			rel: 'preconnect',
			href: 'https://fonts.gstatic.com',
			crossOrigin: 'anonymous',
		},
		{
			rel: 'stylesheet',
			href: 'https://fonts.googleapis.com/css2?family=Racing+Sans+One&family=Roboto&family=Ubuntu:ital,wght@0,400;0,700;1,400&display=swap',
		},
	]
}

export const meta: MetaFunction = () => {
	return { title: 'New Remix App' }
}

type LoaderData = {
	user: User
}

export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request.headers.get('Cookie'))
	const authToken = session.get('access_token')
	const userId = session.get('user_id')

	if (!session.has('access_token')) {
		return json({ user: null })
	}

	const user = await fetch(`http://localhost:4000/api/v1/users/${userId}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	})

	return json({ user: await user.json() })
}

const Document = ({ children }: { children: ReactNode }) => (
	<html lang='en'>
		<head>
			<meta charSet='utf-8' />
			<meta name='viewport' content='width=device-width,initial-scale=1' />
			<Meta />
			<Links />
		</head>
		<body className='font-standard bg-dark-purple'>
			{children}
			<ScrollRestoration />
			<Scripts />
			{process.env.NODE_ENV === 'development' && <LiveReload />}
		</body>
	</html>
)

const App = () => {
	const { user } = useLoaderData<LoaderData>()

	return (
		<UserProvider currentUser={user}>
			<Document>
				<Outlet />
			</Document>
		</UserProvider>
	)
}
export default App
