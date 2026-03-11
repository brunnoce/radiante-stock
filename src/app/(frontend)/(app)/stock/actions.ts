'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-actions'
import { createMovimiento } from '@/app/services/movimientos.service'
import { revalidatePath } from 'next/cache'

const bulkIngresoSchema = z.object({
  lines: z
    .array(
      z.object({
        bebidaId: z.number().positive(),
        cantidad: z.number().int().min(1, 'Mínimo 1'),
      }),
    )
    .min(1, 'Agregá al menos una línea'),
})

export const bulkIngresoAction = authActionClient
  .schema(bulkIngresoSchema)
  .action(async ({ parsedInput, ctx }) => {
    const results = []

    for (const line of parsedInput.lines) {
      const movimiento = await createMovimiento({
        bebidaId: line.bebidaId,
        tipo: 'ingreso',
        cantidad: line.cantidad,
        usuarioId: ctx.user.id,
      })
      results.push(movimiento)
    }

    revalidatePath('/')
    revalidatePath('/stock')
    revalidatePath('/historial')

    return { count: results.length }
  })

const stockAdjustmentSchema = z.object({
  changes: z
    .array(
      z.object({
        bebidaId: z.number().positive(),
        from: z.number().int().min(0),
        to: z.number().int().min(0),
      }),
    )
    .min(1, 'No hay cambios para guardar'),
})

export const stockAdjustmentAction = authActionClient
  .schema(stockAdjustmentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const results = []

    for (const change of parsedInput.changes) {
      const diff = change.to - change.from
      const tipo = diff > 0 ? 'ingreso' : 'egreso'
      const cantidad = Math.abs(diff)

      if (cantidad === 0) continue

      const movimiento = await createMovimiento({
        bebidaId: change.bebidaId,
        tipo: tipo as 'ingreso' | 'egreso',
        cantidad,
        usuarioId: ctx.user.id,
      })
      results.push(movimiento)
    }

    revalidatePath('/')
    revalidatePath('/stock')
    revalidatePath('/historial')

    return { count: results.length }
  })
