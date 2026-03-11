'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

export function HistorialFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (!value || value === 'todos') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por bebida..."
          className="pl-9"
          defaultValue={searchParams.get('q') ?? ''}
          onChange={(e) => updateParam('q', e.target.value)}
        />
      </div>
      <Select
        defaultValue={searchParams.get('tipo') ?? 'todos'}
        onValueChange={(v) => updateParam('tipo', v)}
      >
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="ingreso">Ingreso</SelectItem>
          <SelectItem value="egreso">Egreso</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="date"
        className="w-full sm:w-[160px]"
        defaultValue={searchParams.get('fecha') ?? ''}
        onChange={(e) => updateParam('fecha', e.target.value)}
      />
    </div>
  )
}
