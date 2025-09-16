import { AuthForm } from '@/components/authform'
// import { auth } from '@/lib/auth'
// import { redirect } from 'next/navigation'

export default async function SignInPage() {
    // const session = await auth()

    // Redirect if already authenticated
    // if (session) {
    //     redirect('/')
    // }

    return <AuthForm mode="signin" />
}

