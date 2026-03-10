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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

const MOCK_MOVEMENTS = [
  {
    id: '1',
    beverage: 'Fernet Branca',
    type: 'ingreso' as const,
    quantity: 6,
    currentStock: 8,
    date: '2026-03-08',
    user: 'Marcos',
  },
  {
    id: '2',
    beverage: 'Coca-Cola 1.5L',
    type: 'ingreso' as const,
    quantity: 24,
    currentStock: 30,
    date: '2026-03-08',
    user: 'Marcos',
  },
  {
    id: '3',
    beverage: 'Fernet Branca',
    type: 'egreso' as const,
    quantity: 6,
    currentStock: 2,
    date: '2026-03-07',
    user: 'Lucas',
  },
  {
    id: '4',
    beverage: 'Malbec Trumpeter',
    type: 'egreso' as const,
    quantity: 3,
    currentStock: 0,
    date: '2026-03-07',
    user: 'Lucas',
  },
  {
    id: '5',
    beverage: 'Red Bull',
    type: 'ingreso' as const,
    quantity: 12,
    currentStock: 20,
    date: '2026-03-06',
    user: 'Brunno',
  },
  {
    id: '6',
    beverage: 'Campari',
    type: 'egreso' as const,
    quantity: 2,
    currentStock: 3,
    date: '2026-03-06',
    user: 'Lucas',
  },
  {
    id: '7',
    beverage: 'Sprite 1.5L',
    type: 'ingreso' as const,
    quantity: 12,
    currentStock: 24,
    date: '2026-03-05',
    user: 'Marcos',
  },
  {
    id: '8',
    beverage: 'Gancia',
    type: 'egreso' as const,
    quantity: 1,
    currentStock: 5,
    date: '2026-03-05',
    user: 'Brunno',
  },
]

export const metadata = {
  title: 'Historial - Radiante Stock',
}

export default function HistorialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Historial</h1>
        <p className="text-sm text-muted-foreground">Registro de movimientos de stock</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por bebida..." className="pl-9" />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ingreso">Ingreso</SelectItem>
            <SelectItem value="egreso">Egreso</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" className="w-full sm:w-[160px]" />
      </div>

      {/* Tabla desktop */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Bebida</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Stock actual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_MOVEMENTS.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDate(mov.date)}
                    </TableCell>
                    <TableCell className="font-medium">{mov.beverage}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`gap-1 ${mov.type === 'ingreso' ? 'border-green-500/50 text-green-500' : 'border-red-400/50 text-red-400'}`}
                      >
                        {mov.type === 'ingreso' ? (
                          <ArrowUpCircle className="h-3 w-3" />
                        ) : (
                          <ArrowDownCircle className="h-3 w-3" />
                        )}
                        {mov.type === 'ingreso' ? 'Ingreso' : 'Egreso'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {mov.user}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      <span className={mov.type === 'ingreso' ? 'text-green-500' : 'text-red-400'}>
                        {mov.type === 'ingreso' ? '+' : '-'}
                        {mov.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {mov.currentStock}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Cards mobile */}
      <div className="space-y-2 md:hidden">
        {MOCK_MOVEMENTS.map((mov) => (
          <Card key={mov.id}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{mov.beverage}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`gap-1 text-xs ${mov.type === 'ingreso' ? 'border-green-500/50 text-green-500' : 'border-red-400/50 text-red-400'}`}
                    >
                      {mov.type === 'ingreso' ? (
                        <ArrowUpCircle className="h-3 w-3" />
                      ) : (
                        <ArrowDownCircle className="h-3 w-3" />
                      )}
                      {mov.type === 'ingreso' ? 'Ingreso' : 'Egreso'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(mov.date)}</span>
                    <span className="text-xs text-muted-foreground">· {mov.user}</span>
                  </div>
                </div>
                <div className="ml-3 text-right">
                  <span
                    className={`text-lg font-bold tabular-nums ${
                      mov.type === 'ingreso' ? 'text-green-500' : 'text-red-400'
                    }`}
                  >
                    {mov.type === 'ingreso' ? '+' : '-'}
                    {mov.quantity}
                  </span>
                  <p className="text-xs text-muted-foreground">Stock: {mov.currentStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
}
