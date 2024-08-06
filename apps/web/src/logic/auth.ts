'use server'
import { auth } from "@/auth"
import { db, usersTable } from "@/db"
import { eq } from "drizzle-orm"

export const currentUser = async () => {
	const session = await auth()

	return session?.user
}

export const getUserByEmail = async (email: string) => {
	const users = await db.select().from(usersTable).where(eq(usersTable.email, email))
	const user = users[0]
	return user
}

export const getUserById = async (id: string) => {
	const users = await db.select().from(usersTable).where(eq(usersTable.id, id))
	const user = users[0]
	return user
}