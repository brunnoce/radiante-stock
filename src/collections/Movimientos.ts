import type { CollectionConfig } from 'payload'

export const Movimientos: CollectionConfig = {
  slug: 'movimientos',
  labels: {
    singular: 'Movimiento',
    plural: 'Movimientos',
  },
  admin: {
    defaultColumns: ['bebida', 'tipo', 'cantidad', 'createdAt'],
  },
  fields: [
    {
      name: 'bebida',
      type: 'relationship',
      relationTo: 'bebidas',
      required: true,
    },
    {
      name: 'tipo',
      type: 'select',
      required: true,
      options: [
        { label: 'Ingreso', value: 'ingreso' },
        { label: 'Egreso', value: 'egreso' },
      ],
    },
    {
      name: 'cantidad',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'stockAnterior',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'stockResultante',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'usuario',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
      },
    },
  ],
}
