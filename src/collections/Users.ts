import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 5 * 60 * 1000,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'username',
      type: 'text',
      unique: true,
      admin: {
        description: 'Nombre de usuario para iniciar sesión (opcional)',
      },
    },
  ],
}
