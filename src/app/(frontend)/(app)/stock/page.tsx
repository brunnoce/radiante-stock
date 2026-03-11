import type { Categoria } from '@/payload-types'
import { StockManager } from '@/components/StockManager'
import { BulkIngresoForm } from '@/components/BulkIngresoForm'
import { getBebidas } from '@/app/services/bebidas.service'

export const metadata = {
  title: 'Gestión de Stock - Radiante Stock',
}

export default async function StockPage() {
  const bebidas = await getBebidas()

  const beverages = bebidas.map((b) => ({
    id: b.id,
    name: b.nombre,
    category: (b.categoria as Categoria).nombre,
    currentStock: b.stock,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Stock</h1>
        <p className="text-sm text-muted-foreground">Cargá un ingreso o ajustá el stock</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Ingreso de mercadería</h2>
        <BulkIngresoForm beverages={beverages} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Ajuste rápido</h2>
        <StockManager beverages={beverages} />
      </section>
    </div>
  )
}
