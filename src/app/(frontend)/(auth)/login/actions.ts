'use server'

import { cookies } from 'next/headers'
import { actionClient } from '@/lib/safe-actions'
import { loginUser } from '@/app/services/users.service'
import { loginSchema } from './schema'

export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput }) => {
    const { identifier, password } = parsedInput
    const result = await loginUser(identifier, password)

    const cookieStore = await cookies()
    cookieStore.set('payload-token', result.token ?? '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7200,
    })

    return { user: result.user }
  })
