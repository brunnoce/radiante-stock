import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, AlertTriangle } from 'lucide-react'

const MOCK_BEVERAGES = [
  { id: '1', name: 'Fernet Branca', category: 'Fernet', currentStock: 2, lowStockThreshold: 3 },
  { id: '2', name: 'Coca-Cola 1.5L', category: 'Gaseosa', currentStock: 18, lowStockThreshold: 5 },
  { id: '3', name: 'Sprite 1.5L', category: 'Gaseosa', currentStock: 12, lowStockThreshold: 5 },
  { id: '4', name: 'Malbec Trumpeter', category: 'Vino', currentStock: 0, lowStockThreshold: 3 },
  { id: '5', name: 'Campari', category: 'Vermouth', currentStock: 3, lowStockThreshold: 3 },
  { id: '6', name: 'Gancia', category: 'Vermouth', currentStock: 5, lowStockThreshold: 3 },
  { id: '7', name: 'Red Bull', category: 'Energizante', currentStock: 8, lowStockThreshold: 5 },
  { id: '8', name: 'Agua Tónica', category: 'Agua', currentStock: 1, lowStockThreshold: 3 },
  { id: '9', name: 'Cerveza Corona', category: 'Cerveza', currentStock: 24, lowStockThreshold: 5 },
  { id: '10', name: 'Jagermeister', category: 'Otro', currentStock: 0, lowStockThreshold: 3 },
]

function getStockStatus(stock: number, threshold: number) {
  if (stock === 0) return 'critical'
  if (stock <= threshold) return 'warning'
  return 'ok'
}

export default function VistaGeneralPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vista General</h1>
        <p className="text-sm text-muted-foreground">Stock actual de bebidas</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar bebida..." className="pl-9" />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="vino">Vino</SelectItem>
            <SelectItem value="gaseosa">Gaseosa</SelectItem>
            <SelectItem value="cerveza">Cerveza</SelectItem>
            <SelectItem value="fernet">Fernet</SelectItem>
            <SelectItem value="vermouth">Vermouth</SelectItem>
            <SelectItem value="agua">Agua</SelectItem>
            <SelectItem value="energizante">Energizante</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Nombre A-Z</SelectItem>
            <SelectItem value="name-desc">Nombre Z-A</SelectItem>
            <SelectItem value="stock-asc">Menor stock</SelectItem>
            <SelectItem value="stock-desc">Mayor stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de bebidas */}
      <div className="space-y-1">
        {MOCK_BEVERAGES.map((beverage) => {
          const status = getStockStatus(beverage.currentStock, beverage.lowStockThreshold)
          return (
            <div
              key={beverage.id}
              className={`flex items-center justify-between rounded-md border px-4 py-3 ${
                status === 'critical'
                  ? 'border-destructive/50 bg-destructive/5'
                  : status === 'warning'
                    ? 'border-warning/50 bg-warning/5'
                    : 'border-border'
              }`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <p className="truncate font-medium">{beverage.name}</p>
                <Badge variant="outline" className="shrink-0 text-xs">
                  {beverage.category}
                </Badge>
              </div>
              <div className="ml-4 flex items-center gap-2">
                {status !== 'ok' && (
                  <AlertTriangle
                    className={`h-4 w-4 ${
                      status === 'critical' ? 'text-destructive' : 'text-warning'
                    }`}
                  />
                )}
                <span
                  className={`text-lg font-bold tabular-nums ${
                    status === 'critical'
                      ? 'text-destructive'
                      : status === 'warning'
                        ? 'text-warning'
                        : 'text-foreground'
                  }`}
                >
                  {beverage.currentStock}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
