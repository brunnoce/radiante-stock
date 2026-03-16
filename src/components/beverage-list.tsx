'use client'

import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'

type BeverageItem = {
  id: number
  nombre: string
  categoria: string
  stock: number
  stockMinimo: number
}

type SortOption = 'name-asc' | 'name-desc' | 'stock-asc' | 'stock-desc'

function getStockStatus(stock: number, stockMinimo: number) {
  if (stock === 0) return 'critical'
  if (stock <= stockMinimo) return 'warning'
  return 'ok'
}

export function BeverageList({
  bebidas,
  categorias,
}: {
  bebidas: BeverageItem[]
  categorias: { id: number; nombre: string }[]
}) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('todas')
  const [sort, setSort] = useState<SortOption>('name-asc')
  const [page, setPage] = useState(1)

  const categoryName = useMemo(() => {
    if (categoryFilter === 'todas') return null
    return categorias.find((c) => String(c.id) === categoryFilter)?.nombre ?? null
  }, [categorias, categoryFilter])

  const filtered = useMemo(() => {
    let result = bebidas.filter((b) => {
      const matchesSearch = b.nombre.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = !categoryName || b.categoria === categoryName
      return matchesSearch && matchesCategory
    })

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return a.nombre.localeCompare(b.nombre)
        case 'name-desc':
          return b.nombre.localeCompare(a.nombre)
        case 'stock-asc':
          return a.stock - b.stock
        case 'stock-desc':
          return b.stock - a.stock
      }
    })

    return result
  }, [bebidas, categoryName, search, sort])

  const PAGE_SIZE = 10
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleFilterChange<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value)
      setPage(1)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar bebida..."
            className="pl-9"
            value={search}
            onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={handleFilterChange(setCategoryFilter)}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {categorias.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => handleFilterChange(setSort)(v as SortOption)}>
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

      <div className="space-y-1">
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No se encontraron bebidas
          </p>
        )}
        {paginated.map((bebida) => {
          const status = getStockStatus(bebida.stock, bebida.stockMinimo)
          return (
            <div
              key={bebida.id}
              className={`flex items-center justify-between rounded-md border px-4 py-3 ${
                status === 'critical'
                  ? 'border-destructive/50 bg-destructive/5'
                  : status === 'warning'
                    ? 'border-warning/50 bg-warning/5'
                    : 'border-border'
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium sm:text-base">{bebida.nombre}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {bebida.categoria}
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
                  {bebida.stock}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={safePage === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {safePage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={safePage === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  )
}
