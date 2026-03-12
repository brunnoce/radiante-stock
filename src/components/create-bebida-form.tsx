'use client'

import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { createBebidaAction } from '@/app/(frontend)/(app)/admin-panel/actions'

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  categoria: z.string().min(1, 'Seleccioná una categoría'),
  stock: z.string().min(1, 'Ingresá el stock actual'),
  stockMinimo: z.string().min(1, 'Ingresá el stock mínimo'),
})

type FormValues = z.infer<typeof schema>

type Categoria = {
  id: number
  nombre: string
}

export function CreateBebidaForm({ categorias }: { categorias: Categoria[] }) {
  const { executeAsync, isExecuting } = useAction(createBebidaAction)

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: { nombre: '', categoria: '', stock: '0', stockMinimo: '3' },
  })

  async function onSubmit(values: FormValues) {
    const result = await executeAsync({
      nombre: values.nombre,
      categoria: Number(values.categoria),
      stock: Number(values.stock),
      stockMinimo: Number(values.stockMinimo),
    })

    if (result?.serverError) {
      toast.error(result.serverError)
      return
    }

    if (result?.data) {
      toast.success(`Bebida "${values.nombre}" creada`)
      form.reset()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Fernet Branca" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem className="w-full sm:w-48">
                <FormLabel>Categoría</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="w-full sm:w-32">
                <FormLabel>Stock actual</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stockMinimo"
            render={({ field }) => (
              <FormItem className="w-full sm:w-32">
                <FormLabel>Stock mínimo</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" size="sm" className="gap-1" disabled={isExecuting}>
          {isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Crear bebida
        </Button>
      </form>
    </Form>
  )
}
