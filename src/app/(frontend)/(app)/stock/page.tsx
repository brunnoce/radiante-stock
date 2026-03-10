import { StockManager } from '@/components/StockManager'
import { BulkIngresoForm } from '@/components/BulkIngresoForm'

const MOCK_BEVERAGES = [
  { id: '1', name: 'Fernet Branca', category: 'Fernet', currentStock: 2 },
  { id: '2', name: 'Coca-Cola 1.5L', category: 'Gaseosa', currentStock: 18 },
  { id: '3', name: 'Sprite 1.5L', category: 'Gaseosa', currentStock: 12 },
  { id: '4', name: 'Malbec Trumpeter', category: 'Vino', currentStock: 0 },
  { id: '5', name: 'Campari', category: 'Vermouth', currentStock: 3 },
  { id: '6', name: 'Gancia', category: 'Vermouth', currentStock: 5 },
  { id: '7', name: 'Red Bull', category: 'Energizante', currentStock: 8 },
  { id: '8', name: 'Agua Tónica', category: 'Agua', currentStock: 1 },
  { id: '9', name: 'Cerveza Corona', category: 'Cerveza', currentStock: 24 },
  { id: '10', name: 'Jagermeister', category: 'Otro', currentStock: 0 },
]

export const metadata = {
  title: 'Gestión de Stock - Radiante Stock',
}

export default function StockPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Stock</h1>
        <p className="text-sm text-muted-foreground">Cargá un ingreso o ajustá el stock</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Ingreso de mercadería</h2>
        <BulkIngresoForm beverages={MOCK_BEVERAGES} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Ajuste rápido</h2>
        <StockManager beverages={MOCK_BEVERAGES} />
      </section>
    </div>
  )
}
