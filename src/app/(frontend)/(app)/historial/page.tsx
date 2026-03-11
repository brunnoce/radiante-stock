import type { Bebida, User } from '@/payload-types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowUpCircle, ArrowDownCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { getMovimientos } from '@/app/services/movimientos.service'
import { HistorialFilters } from '@/components/historial-filters'
import Link from 'next/link'

export const metadata = {
  title: 'Historial - Radiante Stock',
}

interface HistorialPageProps {
  searchParams: Promise<{
    tipo?: string
    fecha?: string
    q?: string
    page?: string
  }>
}

export default async function HistorialPage({ searchParams }: HistorialPageProps) {
  const params = await searchParams
  const tipo = params.tipo === 'ingreso' || params.tipo === 'egreso' ? params.tipo : undefined
  const fecha = params.fecha ?? undefined
  const query = params.q?.toLowerCase() ?? ''
  const currentPage = Number(params.page) || 1

  const result = await getMovimientos({ tipo, fecha, page: currentPage, limit: 20 })

  const movimientos = query
    ? result.docs.filter((mov) => {
        const bebida = mov.bebida as Bebida
        return bebida.nombre.toLowerCase().includes(query)
      })
    : result.docs

  function buildPageUrl(page: number) {
    const p = new URLSearchParams()
    if (tipo) p.set('tipo', tipo)
    if (fecha) p.set('fecha', fecha)
    if (query) p.set('q', query)
    if (page > 1) p.set('page', String(page))
    const qs = p.toString()
    return qs ? `/historial?${qs}` : '/historial'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Historial</h1>
        <p className="text-sm text-muted-foreground">Registro de movimientos de stock</p>
      </div>

      <HistorialFilters />

      {movimientos.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No se encontraron movimientos
        </p>
      )}

      <div className="hidden md:block">
        {movimientos.length > 0 && (
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
                    <TableHead className="text-right">Stock resultante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimientos.map((mov) => {
                    const bebida = mov.bebida as Bebida
                    const usuario = mov.usuario as User
                    return (
                      <TableRow key={mov.id}>
                        <TableCell className="text-muted-foreground">
                          {formatDate(mov.createdAt)}
                        </TableCell>
                        <TableCell className="font-medium">{bebida.nombre}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`gap-1 ${mov.tipo === 'ingreso' ? 'border-green-500/50 text-green-500' : 'border-red-400/50 text-red-400'}`}
                          >
                            {mov.tipo === 'ingreso' ? (
                              <ArrowUpCircle className="h-3 w-3" />
                            ) : (
                              <ArrowDownCircle className="h-3 w-3" />
                            )}
                            {mov.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {usuario.name}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          <span className={mov.tipo === 'ingreso' ? 'text-green-500' : 'text-red-400'}>
                            {mov.tipo === 'ingreso' ? '+' : '-'}
                            {mov.cantidad}
                          </span>
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-medium">
                          {mov.stockResultante}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-2 md:hidden">
        {movimientos.map((mov) => {
          const bebida = mov.bebida as Bebida
          const usuario = mov.usuario as User
          return (
            <Card key={mov.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{bebida.nombre}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`gap-1 text-xs ${mov.tipo === 'ingreso' ? 'border-green-500/50 text-green-500' : 'border-red-400/50 text-red-400'}`}
                      >
                        {mov.tipo === 'ingreso' ? (
                          <ArrowUpCircle className="h-3 w-3" />
                        ) : (
                          <ArrowDownCircle className="h-3 w-3" />
                        )}
                        {mov.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(mov.createdAt)}</span>
                      <span className="text-xs text-muted-foreground">· {usuario.name}</span>
                    </div>
                  </div>
                  <div className="ml-3 text-right">
                    <span
                      className={`text-lg font-bold tabular-nums ${
                        mov.tipo === 'ingreso' ? 'text-green-500' : 'text-red-400'
                      }`}
                    >
                      {mov.tipo === 'ingreso' ? '+' : '-'}
                      {mov.cantidad}
                    </span>
                    <p className="text-xs text-muted-foreground">Stock: {mov.stockResultante}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {result.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {currentPage > 1 ? (
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <Link href={buildPageUrl(currentPage - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            {currentPage} / {result.totalPages}
          </span>
          {currentPage < result.totalPages ? (
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <Link href={buildPageUrl(currentPage + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })
}
