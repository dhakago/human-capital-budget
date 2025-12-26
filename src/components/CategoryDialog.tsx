import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BudgetCategory, BudgetSubItem } from '@/lib/budget-utils'
import { toast } from 'sonner'

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: BudgetCategory
  onSave: (category: Omit<BudgetCategory, 'id'> & { id?: string }) => void
}

export function CategoryDialog({ open, onOpenChange, category, onSave }: CategoryDialogProps) {
  const [name, setName] = useState('')
  const [subItems, setSubItems] = useState<BudgetSubItem[]>([])

  useEffect(() => {
    if (open) {
      setName(category?.name || '')
      setSubItems(category?.subItems || [])
    }
  }, [open, category])

  const handleAddSubItem = () => {
    setSubItems([...subItems, { id: `sub-${Date.now()}`, name: '', monthlyBudget: 0 }])
  }

  const handleUpdateSubItem = (index: number, field: 'name' | 'monthlyBudget', value: string | number) => {
    const updated = [...subItems]
    if (field === 'name') {
      updated[index].name = value as string
    } else {
      updated[index].monthlyBudget = Number(value)
    }
    setSubItems(updated)
  }

  const handleRemoveSubItem = (index: number) => {
    setSubItems(subItems.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Nama kategori harus diisi')
      return
    }

    const validSubItems = subItems.filter(item => item.name.trim() !== '')
    
    if (validSubItems.length === 0) {
      toast.error('Minimal harus ada 1 sub-item')
      return
    }

    const totalBudget = validSubItems.reduce((sum, item) => sum + item.monthlyBudget, 0)

    onSave({
      id: category?.id,
      name: name.trim(),
      monthlyBudget: totalBudget,
      subItems: validSubItems
    })

    setName('')
    setSubItems([])
    onOpenChange(false)
    toast.success(category ? 'Kategori berhasil diperbarui' : 'Kategori berhasil ditambahkan')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Nama Kategori</Label>
            <Input
              id="category-name"
              placeholder="Contoh: BIAYA KANTOR"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Sub-Item Budget</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddSubItem}>
                Tambah Sub-Item
              </Button>
            </div>

            <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
              {subItems.map((item, index) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Nama sub-item"
                      value={item.name}
                      onChange={(e) => handleUpdateSubItem(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="w-48">
                    <Input
                      type="number"
                      placeholder="Budget per bulan"
                      value={item.monthlyBudget}
                      onChange={(e) => handleUpdateSubItem(index, 'monthlyBudget', e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSubItem(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              
              {subItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Belum ada sub-item. Klik "Tambah Sub-Item" untuk menambahkan.
                </p>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Total Budget: Rp {subItems.reduce((sum, item) => sum + item.monthlyBudget, 0).toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>
            {category ? 'Perbarui' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
