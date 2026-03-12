import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getCategorias } from '@/app/services/categorias.service'
import { getBebidas } from '@/app/services/bebidas.service'
import { CreateCategoriaForm } from '@/components/create-categoria-form'
import { CreateBebidaForm } from '@/components/create-bebida-form'

export const metadata = {
  title: 'Administración - Radiante Stock',
}

export default async function AdminPanelPage() {
  const [categorias, bebidas] = await Promise.all([getCategorias(), getBebidas()])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Administración</h1>
          <p className="text-sm text-muted-foreground">Creá categorías y bebidas</p>
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          Panel avanzado
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nueva categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateCategoriaForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nueva bebida</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateBebidaForm categorias={categorias.map((c) => ({ id: c.id, nombre: c.nombre }))} />
        </CardContent>
      </Card>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Categorías existentes</h2>
        <div className="flex flex-wrap gap-2">
          {categorias.map((cat) => (
            <Badge key={cat.id} variant="outline">
              {cat.nombre}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Bebidas cargadas
          <span className="ml-2 text-sm font-normal text-muted-foreground">({bebidas.length})</span>
        </h2>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {bebidas.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-md border px-3 py-2">
              <span className="truncate text-sm">{b.nombre}</span>
              <Badge variant="outline" className="ml-2 shrink-0 text-xs">
                {typeof b.categoria === 'object' ? b.categoria.nombre : ''}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
