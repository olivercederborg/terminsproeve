import { Links, LinksFunction, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from 'remix'
import type { MetaFunction } from 'remix'
import styles from './styles/app.css'

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

export default function App() {
	return (
		<html lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width,initial-scale=1' />
				<Meta />
				<Links />
			</head>
			<body className='font-standard'>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				{process.env.NODE_ENV === 'development' && <LiveReload />}
			</body>
		</html>
	)
}
