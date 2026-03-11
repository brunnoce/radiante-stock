import type { Bebida } from '@/payload-types'
import { getPayloadInstance } from '@/lib/payload'

export async function getBebidas() {
  const payload = await getPayloadInstance()

  const result = await payload.find({
    collection: 'bebidas',
    sort: 'nombre',
    limit: 500,
    overrideAccess: true,
    depth: 1,
  })

  return result.docs
}

export async function getBebidaById(id: number): Promise<Bebida> {
  const payload = await getPayloadInstance()

  return payload.findByID({
    collection: 'bebidas',
    id,
    overrideAccess: true,
    depth: 1,
  })
}

export async function updateBebidaStock(id: number, newStock: number) {
  const payload = await getPayloadInstance()

  return payload.update({
    collection: 'bebidas',
    id,
    data: { stock: newStock },
    overrideAccess: true,
  })
}
