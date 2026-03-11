'use client'

import { useState } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, PackagePlus, Loader2 } from 'lucide-react'
import { bulkIngresoAction } from '@/app/(frontend)/(app)/stock/actions'

type Beverage = {
  id: number
  name: string
  category: string
  currentStock: number
}

type IngresoLine = {
  beverageId: string
  quantity: string
}

export function BulkIngresoForm({ beverages }: { beverages: Beverage[] }) {
  const [lines, setLines] = useState<IngresoLine[]>([{ beverageId: '', quantity: '' }])
  const { executeAsync, isExecuting } = useAction(bulkIngresoAction)

  function addLine() {
    setLines((prev) => [...prev, { beverageId: '', quantity: '' }])
  }

  function removeLine(index: number) {
    setLines((prev) => prev.filter((_, i) => i !== index))
  }

  function updateLine(index: number, field: keyof IngresoLine, value: string) {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, [field]: value } : line)))
  }

  async function handleSubmit() {
    const validLines = lines.filter(
      (line) => line.beverageId !== '' && line.quantity !== '' && Number(line.quantity) > 0,
    )

    if (validLines.length === 0) {
      toast.error('Completá al menos una línea con bebida y cantidad')
      return
    }

    const result = await executeAsync({
      lines: validLines.map((line) => ({
        bebidaId: Number(line.beverageId),
        cantidad: Number(line.quantity),
      })),
    })

    if (result?.serverError) {
      toast.error(result.serverError)
      return
    }

    if (result?.data) {
      toast.success(`Se registraron ${result.data.count} ingresos`)
      setLines([{ beverageId: '', quantity: '' }])
    }
  }

  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        {lines.map((line, index) => (
          <div key={index} className="flex items-center gap-2">
            <Select
              value={line.beverageId}
              onValueChange={(v) => updateLine(index, 'beverageId', v)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Seleccionar bebida" />
              </SelectTrigger>
              <SelectContent>
                {beverages.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min="1"
              placeholder="Cant."
              className="w-20"
              value={line.quantity}
              onChange={(e) => updateLine(index, 'quantity', e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeLine(index)}
              disabled={lines.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={addLine}>
            <Plus className="h-4 w-4" />
            Agregar línea
          </Button>
          <Button
            size="sm"
            className="ml-auto gap-1"
            onClick={handleSubmit}
            disabled={isExecuting}
          >
            {isExecuting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackagePlus className="h-4 w-4" />}
            Registrar ingreso
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
