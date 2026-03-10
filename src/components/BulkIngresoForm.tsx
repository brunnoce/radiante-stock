'use client'

import { useState } from 'react'
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
import { Plus, Trash2, PackagePlus } from 'lucide-react'

type Beverage = {
  id: string
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

  function addLine() {
    setLines((prev) => [...prev, { beverageId: '', quantity: '' }])
  }

  function removeLine(index: number) {
    setLines((prev) => prev.filter((_, i) => i !== index))
  }

  function updateLine(index: number, field: keyof IngresoLine, value: string) {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, [field]: value } : line)))
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
                  <SelectItem key={b.id} value={b.id}>
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
          <Button size="sm" className="ml-auto gap-1">
            <PackagePlus className="h-4 w-4" />
            Registrar ingreso
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
