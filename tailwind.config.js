module.exports = {
	content: ['./app/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'light-gray': '#eaeaea',
				'light-pink': '#E1A1E9',
				'dark-purple': '#5E2E53',
			},
			backgroundImage: {
				'welcome-image': 'url("/assets/splash-image.jpg")',
			},
			fontFamily: {
				roboto: ['Roboto', 'sans-serif'],
				racing: ['Racing Sans One', 'sans-serif'],
				standard: ['Ubuntu', 'sans-serif'],
			},
		},
	},
	plugins: [],
}
