export type Activity = {
	asset: {
		id: number
		url: string
		createdAt: string
		updatedAt: string
	}
	assetId: number
	createdAt: string
	description: string
	id: number
	instructorId: number
	maxAge: number
	maxParticipants: number
	minAge: number
	name: string
	time: string
	updatedAt: string
	users: any[]
	weekday: string
}
