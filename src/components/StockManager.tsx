'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Minus,
  Plus,
  Save,
  Search,
  Undo2,
} from 'lucide-react'
import { stockAdjustmentAction } from '@/app/(frontend)/(app)/stock/actions'

type Beverage = {
  id: number
  name: string
  category: string
  currentStock: number
}

const PAGE_SIZE = 10

export function StockManager({ beverages }: { beverages: Beverage[] }) {
  const initialStocks = useMemo(
    () => Object.fromEntries(beverages.map((b) => [b.id, b.currentStock])),
    [beverages],
  )

  const [stocks, setStocks] = useState<Record<number, number>>(initialStocks)

  useEffect(() => {
    setStocks(initialStocks)
  }, [initialStocks])

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [page, setPage] = useState(1)
  const { executeAsync, isExecuting } = useAction(stockAdjustmentAction)

  const categories = useMemo(
    () => [...new Set(beverages.map((b) => b.category))].sort(),
    [beverages],
  )

  const filtered = useMemo(() => {
    return beverages.filter((b) => {
      const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [beverages, search, categoryFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePageNumber = Math.min(page, totalPages)
  const paginated = filtered.slice((safePageNumber - 1) * PAGE_SIZE, safePageNumber * PAGE_SIZE)

  const changes = useMemo(() => {
    const diffs: { id: number; name: string; from: number; to: number }[] = []
    for (const b of beverages) {
      const current = stocks[b.id] ?? 0
      if (current !== b.currentStock) {
        diffs.push({ id: b.id, name: b.name, from: b.currentStock, to: current })
      }
    }
    return diffs
  }, [stocks, beverages])

  const hasChanges = changes.length > 0

  function handleIncrement(id: number) {
    setStocks((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  }

  function handleDecrement(id: number) {
    setStocks((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) - 1),
    }))
  }

  function handleStockInput(id: number, value: string) {
    const parsed = parseInt(value, 10)
    if (value === '') {
      setStocks((prev) => ({ ...prev, [id]: 0 }))
      return
    }
    if (!isNaN(parsed) && parsed >= 0) {
      setStocks((prev) => ({ ...prev, [id]: parsed }))
    }
  }

  function handleReset() {
    setStocks(initialStocks)
  }

  async function handleSave() {
    const result = await executeAsync({
      changes: changes.map((c) => ({
        bebidaId: c.id,
        from: c.from,
        to: c.to,
      })),
    })

    if (result?.serverError) {
      toast.error(result.serverError)
      return
    }

    if (result?.data) {
      toast.success(`Se guardaron ${result.data.count} ajustes de stock`)
    }
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleCategoryChange(value: string) {
    setCategoryFilter(value)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar bebida..."
            className="pl-9"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {paginated.map((beverage) => {
          const stock = stocks[beverage.id] ?? 0
          const changed = stock !== beverage.currentStock
          return (
            <Card key={beverage.id} className={changed ? 'border-primary/50' : ''}>
              <CardContent className="flex items-center justify-between p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{beverage.name}</p>
                  <Badge variant="outline" className="mt-0.5 text-xs">
                    {beverage.category}
                  </Badge>
                </div>
                <div className="ml-3 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDecrement(beverage.id)}
                    disabled={stock === 0 || isExecuting}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => handleStockInput(beverage.id, e.target.value)}
                    disabled={isExecuting}
                    className={`h-8 w-14 text-center text-lg font-bold tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${changed ? 'text-primary' : ''}`}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleIncrement(beverage.id)}
                    disabled={isExecuting}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No se encontraron bebidas
        </p>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={safePageNumber === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {safePageNumber} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={safePageNumber === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {hasChanges && (
        <div className="sticky bottom-4 flex items-center justify-between rounded-md border border-primary/50 bg-card p-3 shadow-lg">
          <p className="text-sm text-muted-foreground">
            {changes.length} {changes.length === 1 ? 'bebida modificada' : 'bebidas modificadas'}
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={handleReset}
              disabled={isExecuting}
            >
              <Undo2 className="h-4 w-4" />
              Deshacer
            </Button>
            <Button
              size="sm"
              className="gap-1"
              onClick={handleSave}
              disabled={isExecuting}
            >
              {isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Guardar cambios
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
