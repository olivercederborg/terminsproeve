export const getDayName = (locale: string) =>
	new Date().toLocaleDateString(locale, { weekday: 'long' })
