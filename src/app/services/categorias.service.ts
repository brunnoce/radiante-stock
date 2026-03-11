import { getPayloadInstance } from '@/lib/payload'

export async function getCategorias() {
  const payload = await getPayloadInstance()

  const result = await payload.find({
    collection: 'categorias',
    sort: 'nombre',
    limit: 100,
    overrideAccess: true,
  })

  return result.docs
}
