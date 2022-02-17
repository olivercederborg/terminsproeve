import { ContextType, createContext, FC, useContext, useMemo, useState } from 'react'

export type User = {
	id: number
	username: string
	password: string
	firstname: string
	lastname: string
	age: number
	role: string
	createdAt: string
	updatedAt: string
	activities: any[]
} | null

export const UserContext = createContext<{
	user: User
	setUser: (user: User) => void
}>({
	user: null,
	setUser: () => {},
})
export const UserProvider: FC<{ currentUser?: User }> = ({ currentUser, children }) => {
	const [user, setUser] = useState<User>(currentUser || null)

	const value = useMemo(() => ({ user, setUser }), [user, setUser])
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = (): ContextType<typeof UserContext> => useContext(UserContext)
