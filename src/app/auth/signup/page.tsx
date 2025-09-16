import { AuthForm } from '@/components/authform'
// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'

export default async function SignUpPage() {
    // const session = await auth()

    // // Redirect if already authenticated
    // if (session) {
    //     redirect('/dashboard')
    // }

    return <AuthForm mode="signup" />
}