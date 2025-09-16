// import NextAuth from 'next-auth'
// import { NextAuthConfig } from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import GoogleProvider from 'next-auth/providers/google'
// import GitHubProvider from 'next-auth/providers/github'
// import bcrypt from 'bcryptjs'



// export const runtime = 'nodejs'

// export const config = {
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         }),
//         GitHubProvider({
//             clientId: process.env.GITHUB_ID!,
//             clientSecret: process.env.GITHUB_SECRET!,
//         }),
//         CredentialsProvider({
//             name: 'credentials',
//             credentials: {
//                 email: { label: 'Email', type: 'email' },
//                 password: { label: 'Password', type: 'password' },
//             },
//             async authorize(credentials) {
//                 if (!credentials?.email || !credentials?.password) {
//                     return null
//                 }

//                 return {
//                     email: credentials.email,
//                     name: credentials.name,
//                 }
//             },
//         }),
//     ],
//     pages: {
//         signIn: '/auth/signin',
//         signOut: '/auth/signup',
//     },
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id
//             }
//             return token
//         },
//         async session({ session, token }) {
//             if (token) {
//                 session.user.id = token.id as string
//             }
//             return session
//         },
//     },
//     session: {
//         strategy: 'jwt' as const,
//     },
// } satisfies NextAuthConfig

// export const { handlers, auth, signIn, signOut } = NextAuth(config)
