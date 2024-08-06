import NextAuth, { CredentialsSignin, NextAuthConfig } from "next-auth"
// Your own logic for dealing with plaintext password strings; be careful!
import { accountsTable, authenticatorsTable, db, sessionsTable, usersTable, verificationTokensTable } from "@/db"
import { getUserByEmail, getUserById } from "@/logic/auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import bcrypt from "bcrypt"
import CredentialsProvider from "next-auth/providers/credentials"
const githubApiBaseUrl = "https://api.github.com"
class InvalidCredentials extends CredentialsSignin {
	code = "credentials"
}
export const nextAuthConfig: NextAuthConfig = {
	adapter: DrizzleAdapter(db, {
		accountsTable,
		usersTable,
		authenticatorsTable,
		sessionsTable,
		verificationTokensTable,
	}),
	secret: process.env.AUTH_SECRET,
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		redirect: ({ baseUrl, url }) => {
			if (url.startsWith("/")) {
				return `${baseUrl}${url}`
			} else if (new URL(url).origin === baseUrl) {
				return url
			}
			return `${baseUrl}/dashboard`
		},
		jwt: ({
			user,
			token
		}) => {
			if (user) {
				token.sub = user.id
			}
			token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // 30 days
			return token
		},
		session: async ({ session, token }) => {
			session.user.id = token.sub!
			return session
		}
	},
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: "Email", type: "text", placeholder: "dviejo@kfs.es" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null
				}
				const email = credentials.email as string
				const user = await getUserByEmail(email)
				if (!user) {
					// If user doesn't exist, create a new one
					const hashedPassword = await bcrypt.hash(credentials.password as string, 10)
					const [{ id: userId }] = await db.insert(usersTable).values({
						email: email,
						name: email.split('@')[0], // Use part of email as name
						password: hashedPassword,
					}).returning({
						id: usersTable.id,
					})
					const newUser = await getUserById(userId)
					return newUser
				}
				if (!user.password) {
					throw new InvalidCredentials("Invalid credentials", {})
				}
				const isValid = await bcrypt.compare(credentials.password as string, user.password)
				if (!isValid) {
					throw new InvalidCredentials("Invalid credentials", {})
				}
				return user
			}
		}),

	],
}
export const { handlers, signIn, signOut, auth } = NextAuth(nextAuthConfig)