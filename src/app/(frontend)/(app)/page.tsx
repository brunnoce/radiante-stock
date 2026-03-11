import type { Categoria } from '@/payload-types'
import { getBebidas } from '@/app/services/bebidas.service'
import { getCategorias } from '@/app/services/categorias.service'
import { BeverageList } from '@/components/beverage-list'

export default async function VistaGeneralPage() {
  const [bebidas, categorias] = await Promise.all([getBebidas(), getCategorias()])

  const items = bebidas.map((b) => ({
    id: b.id,
    nombre: b.nombre,
    categoria: (b.categoria as Categoria).nombre,
    stock: b.stock,
    stockMinimo: b.stockMinimo,
  }))

  const cats = categorias.map((c) => ({ id: c.id, nombre: c.nombre }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vista General</h1>
        <p className="text-sm text-muted-foreground">Stock actual de bebidas</p>
      </div>
      <BeverageList bebidas={items} categorias={cats} />
    </div>
  )
}
