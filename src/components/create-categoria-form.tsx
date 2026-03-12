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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { createCategoriaAction } from '@/app/(frontend)/(app)/admin-panel/actions'

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
})

type FormValues = z.infer<typeof schema>

export function CreateCategoriaForm() {
  const { executeAsync, isExecuting } = useAction(createCategoriaAction)

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: { nombre: '' },
  })

  async function onSubmit(values: FormValues) {
    const result = await executeAsync(values)

    if (result?.serverError) {
      toast.error(result.serverError)
      return
    }

    if (result?.data) {
      toast.success(`Categoría "${values.nombre}" creada`)
      form.reset()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Cerveza" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm" className="gap-1" disabled={isExecuting}>
          {isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Crear
        </Button>
      </form>
    </Form>
  )
}
