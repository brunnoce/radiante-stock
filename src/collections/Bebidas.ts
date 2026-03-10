import type { CollectionConfig } from 'payload'

export const Bebidas: CollectionConfig = {
  slug: 'bebidas',
  labels: {
    singular: 'Bebida',
    plural: 'Bebidas',
  },
  admin: {
    useAsTitle: 'nombre',
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
    },
    {
      name: 'categoria',
      type: 'relationship',
      relationTo: 'categorias',
      required: true,
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
    },
  ],
}
