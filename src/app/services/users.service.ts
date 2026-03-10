import type { User } from '@/payload-types'
import { getPayloadInstance } from '@/lib/payload'

export async function loginUser(identifier: string, password: string) {
  const payload = await getPayloadInstance()

  let email = identifier
  if (!identifier.includes('@')) {
    const byUsername = await payload.find({
      collection: 'users',
      where: { username: { equals: identifier } },
      select: { email: true },
      limit: 1,
      overrideAccess: true,
    })
    if (byUsername.docs[0]) {
      email = (byUsername.docs[0] as User).email
    }
  }

  return payload.login({
    collection: 'users',
    data: { email, password },
  })
}
