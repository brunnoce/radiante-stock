import type { Where } from 'payload'
import { getPayloadInstance } from '@/lib/payload'
import { getBebidaById, updateBebidaStock } from './bebidas.service'

interface CreateMovimientoInput {
  bebidaId: number
  tipo: 'ingreso' | 'egreso'
  cantidad: number
  usuarioId: number
}

export async function createMovimiento(input: CreateMovimientoInput) {
  const bebida = await getBebidaById(input.bebidaId)
  const stockAnterior = bebida.stock

  const stockResultante =
    input.tipo === 'ingreso'
      ? stockAnterior + input.cantidad
      : stockAnterior - input.cantidad

  if (stockResultante < 0) {
    throw new Error(
      `Stock insuficiente. Stock actual: ${stockAnterior}, egreso solicitado: ${input.cantidad}`,
    )
  }

  const payload = await getPayloadInstance()

  const movimiento = await payload.create({
    collection: 'movimientos',
    data: {
      bebida: input.bebidaId,
      tipo: input.tipo,
      cantidad: input.cantidad,
      stockAnterior,
      stockResultante,
      usuario: input.usuarioId,
    },
    overrideAccess: true,
  })

  await updateBebidaStock(input.bebidaId, stockResultante)

  return movimiento
}

interface GetMovimientosParams {
  tipo?: 'ingreso' | 'egreso'
  fecha?: string
  page?: number
  limit?: number
}

export async function getMovimientos(params: GetMovimientosParams = {}) {
  const payload = await getPayloadInstance()

  const where: Where = {}

  if (params.tipo) {
    where.tipo = { equals: params.tipo }
  }

  if (params.fecha) {
    where.createdAt = {
      greater_than_equal: `${params.fecha}T00:00:00`,
      less_than_equal: `${params.fecha}T23:59:59`,
    }
  }

  const result = await payload.find({
    collection: 'movimientos',
    where,
    sort: '-createdAt',
    page: params.page ?? 1,
    limit: params.limit ?? 50,
    overrideAccess: true,
    depth: 2,
  })

  return result
}
