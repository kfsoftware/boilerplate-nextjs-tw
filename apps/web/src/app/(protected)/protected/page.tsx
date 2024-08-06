import { currentUser } from '@/logic/auth'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
	const user = await currentUser()
	if (!user) {
		return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent('/protected')}`)
	}
	return (
		<>
			<h1>Protected Page</h1>
			<p>This page is protected.</p>
		</>
	)
}
