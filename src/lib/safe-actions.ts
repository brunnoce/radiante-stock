import { headers } from 'next/headers'
import { actionClient } from './safe-action-client'
import { getPayloadInstance } from './payload'

export const authActionClient = actionClient.use(async ({ next }) => {
  const payload = await getPayloadInstance()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) throw new Error('No autenticado')
  return next({ ctx: { user } })
})

export { actionClient }
