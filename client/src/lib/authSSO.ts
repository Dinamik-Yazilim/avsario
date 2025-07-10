import NextAuth from 'next-auth'

import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import Yandex from 'next-auth/providers/yandex'
import GitHub from 'next-auth/providers/github'
// import Slack from 'next-auth/providers/slack'
// import Twitter from 'next-auth/providers/twitter'

import type { NextAuthConfig, DefaultSession } from 'next-auth'

import Nodemailer from '@auth/core/providers/nodemailer'
import Credentials from 'next-auth/providers/credentials'
// import { decode, encode, getToken } from '@auth/core/jwt'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
// import 'next-auth/jwt'
import { postItem } from './fetch'
import { cookies } from 'next/headers'
import { v4 } from 'uuid'
// import { getDeviceId } from './authHelper'

const authOptions = {
  theme: {
    brandColor: '#ffffff',
    buttonText: 'fitifiti qwerty',
    logo: '/img/icon.svg',
    colorScheme: 'dark'
  },
  cookies: {
    callbackUrl: { name: 'aliabi.callbackUrl' },
    sessionToken: { name: 'aliabi.sessionToken' },
    csrfToken: { name: 'aliabi.csrfToken' },
    state: { name: 'aliabi.state' },
    pkceCodeVerifier: { name: 'aliabi.pkce.code_verifier' },
    nonce: { name: 'aliabi.nonce' },
    webauthnChallenge: { name: 'aliabi.webauthnChallenge' }
  },
  // adapter: MongoDBAdapter(clientPromise, {
  //   collections: {
  //     Accounts: 'users_accounts',
  //     Users: 'users',
  //     Sessions: 'users_sessions',
  //     VerificationTokens: 'users_verificationTokens',
  //   },
  //   databaseName: 'aliabidb',
  // }),
  // adapter:UnstorageAdapter(storage),
  session: {
    maxAge: 400 * 86400, // 400 days
    updateAge: 400 * 86400, // 400 days
    strategy: 'jwt'
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID as string,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET as string,
    }),
    Yandex({
      clientId: process.env.AUTH_YANDEX_ID as string,
      clientSecret: process.env.AUTH_YANDEX_SECRET as string,
    }),
    // Twitter({
    //   clientId: process.env.AUTH_TWITTER_ID as string,
    //   clientSecret: process.env.AUTH_TWITTER_SECRET as string,
    // }),
    GitHub({
      clientId: (process.env.NODE_ENV === 'development'
        ? process.env.AUTH_GITHUB_ID_LOCALHOST
        : process.env.AUTH_GITHUB_ID) as string,
      clientSecret: (process.env.NODE_ENV === 'development'
        ? process.env.AUTH_GITHUB_SECRET_LOCALHOST
        : process.env.AUTH_GITHUB_SECRET) as string,
    }),

  ],

  secret: process.env.AUTH_SECRET || '', //.env de var gerek yok
  basePath: '/auth',
  callbacks: {

    async signIn({ user, account, profile, email, credentials }) {
      try {
        let url = ''
        console.log('callback signIn user:', user)
        console.log('callback signIn account:', account)
        console.log('callback signIn profile:', profile)
        console.log('callback signIn email:', email)
        console.log('callback signIn credentials:', credentials)

        switch (account?.provider) {
          case 'google':
            url = `/auth/sso/google`
            break
          case 'yandex':
            url = `/auth/sso/yandex`
            break
          case 'github':
            url = `/auth/sso/github`
            break
          default:
            return false
        }
        console.log('url:', url)
        let deviceId: string = cookies().get('deviceId')?.value || ''
        if (!deviceId) {
          deviceId = v4()
          cookies().set('deviceId', deviceId, { secure: true })
        }
        console.log('deviceId:', deviceId)
        const result = await postItem(url, '', { deviceId: deviceId, user, account, profile })
        console.log('postItem result2:', result)
        cookies().set('token', result.token, { secure: true })
        cookies().set('user', JSON.stringify(result.user), { secure: true })
        // cookies().set('dbList', JSON.stringify(result.dbList), { secure: true })
        // cookies().set('db', result.db || '', { secure: true })
        // cookies().set('firm', result.firm || '', { secure: true })
        // cookies().set('period', result.period || '', { secure: true })
        cookies().set('lang', result.lang || 'tr', { secure: true })
        console.log('return true')
        return true

      } catch (err) {
        console.error('callbacks signIn err:', err)
        return false
      }
    },
  },
  trustHost: true,
  debug: true,
  useSecureCookies: true,
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
