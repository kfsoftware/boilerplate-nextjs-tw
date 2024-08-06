import type { InferSelectModel } from 'drizzle-orm';
import { boolean, integer, jsonb, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

export const usersTable = pgTable("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name"),
	login: text("login"),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
	image: text("image"),
	// wallet integration
	address: text("address"),
	signature: text("signature"),
	nonce: text("nonce"),
	stripeAccountId: text("stripeAccountId"),
	stripeCustomerId: text("stripeCustomerId"),
	// installation id for github
	githubInstallationId: integer("github_installation_id"),
	githubInstallationState: text("github_installation_state"), // installed, removed, not_installed
	githubInstallationData: jsonb("github_installation_data"),
	githubRequireUpdate: boolean("github_require_update").default(false),
	createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
	score: integer("score").default(0).notNull(), // Add score field
	ranking: integer("ranking").default(0).notNull(), // Add ranking field
})
export type UserDB = InferSelectModel<typeof usersTable>



export const accountsTable = pgTable(
	"account",
	{
		userId: text("userId")
			.notNull()
			.references(() => usersTable.id, { onDelete: "cascade" }),

		type: text("type").$type<AdapterAccountType>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		refresh_token_expires_at: integer("refresh_token_expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
		createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
		updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
	},
	(table) => {
		return {
			compositePk: primaryKey({
				columns: [table.provider, table.providerAccountId],
			}),
		}
	}
)
export type AccountDB = InferSelectModel<typeof accountsTable>

export const sessionsTable = pgTable("session", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull(),
})

export type SessionDB = InferSelectModel<typeof sessionsTable>
export const authenticatorsTable = pgTable(
	"authenticator",
	{
		credentialID: text("credentialID").notNull().unique(),
		userId: text("userId")
			.notNull()
			.references(() => usersTable.id, { onDelete: "cascade" }),
		providerAccountId: text("providerAccountId").notNull(),
		credentialPublicKey: text("credentialPublicKey").notNull(),
		counter: integer("counter").notNull(),
		credentialDeviceType: text("credentialDeviceType").notNull(),
		credentialBackedUp: boolean("credentialBackedUp").notNull(),
		transports: text("transports"),
	},
	(authenticator) => ({
		compositePK: primaryKey({
			columns: [authenticator.userId, authenticator.credentialID],
		}),
	})
)
export type AuthenticatorDB = InferSelectModel<typeof authenticatorsTable>

export const verificationTokensTable = pgTable(
	"verificationToken",
	{
		identifier: text("identifier").notNull(),
		token: text("token").notNull(),
		expires: timestamp("expires", { mode: "date" }).notNull(),
	},
	(table) => {
		return {
			compositePk: primaryKey({ columns: [table.identifier, table.token] }),
		}
	}
)
export type VerificationTokenDB = InferSelectModel<typeof verificationTokensTable>
