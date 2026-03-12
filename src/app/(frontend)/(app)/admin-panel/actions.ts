'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-actions'
import { getPayloadInstance } from '@/lib/payload'
import { revalidatePath } from 'next/cache'

const createCategoriaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
})

export const createCategoriaAction = authActionClient
  .schema(createCategoriaSchema)
  .action(async ({ parsedInput }) => {
    const payload = await getPayloadInstance()

    const categoria = await payload.create({
      collection: 'categorias',
      data: { nombre: parsedInput.nombre },
      overrideAccess: true,
    })

    revalidatePath('/admin-panel')
    revalidatePath('/')
    revalidatePath('/stock')

    return { categoria }
  })

const createBebidaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  categoria: z.number().positive('Seleccioná una categoría'),
  stock: z.number().int().min(0, 'Mínimo 0'),
  stockMinimo: z.number().int().min(0, 'Mínimo 0'),
})

export const createBebidaAction = authActionClient
  .schema(createBebidaSchema)
  .action(async ({ parsedInput }) => {
    const payload = await getPayloadInstance()

    const bebida = await payload.create({
      collection: 'bebidas',
      data: {
        nombre: parsedInput.nombre,
        categoria: parsedInput.categoria,
        stock: parsedInput.stock,
        stockMinimo: parsedInput.stockMinimo,
      },
      overrideAccess: true,
    })

    revalidatePath('/admin-panel')
    revalidatePath('/')
    revalidatePath('/stock')

    return { bebida }
  })
