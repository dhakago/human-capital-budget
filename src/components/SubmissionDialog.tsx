import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BudgetCategory } from '@/lib/budget-utils'
import { formatCurrency, formatMonth, getMonthOptions } from '@/lib/budget-utils'
import { toast } from 'sonner'

interface SubmissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: BudgetCategory[]
  onSubmit: (categoryId: string, subItemId: string | undefined, amount: number, description: string, executionMonth: string) => Promise<boolean>
  getRemainingBudget: (categoryId: string, subItemId?: string) => number
  preSelectedCategory?: string
  preSelectedSubItem?: string
}

export function SubmissionDialog({ 
  open, 
  onOpenChange, 
  categories, 
  onSubmit, 
  getRemainingBudget,
  preSelectedCategory,
  preSelectedSubItem 
}: SubmissionDialogProps) {
  const [categoryId, setCategoryId] = useState('')
  const [subItemId, setSubItemId] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [executionMonth, setExecutionMonth] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (preSelectedCategory) {
      setCategoryId(preSelectedCategory)
    }
    if (preSelectedSubItem) {
      setSubItemId(preSelectedSubItem)
    }
  }, [preSelectedCategory, preSelectedSubItem, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!categoryId || !amount || !description || !executionMonth) {
      toast.error('Mohon lengkapi semua field')
      return
    }

    if (!subItemId) {
      toast.error('Mohon pilih sub-item')
      return
    }

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Jumlah harus lebih dari 0')
      return
    }

    const remaining = getRemainingBudget(categoryId, subItemId)
    
    if (numAmount > remaining) {
      const selectedCat = categories.find(c => c.id === categoryId)
      const selectedSub = selectedCat?.subItems.find(s => s.id === subItemId)
      toast.error(
        `Anggaran tidak mencukupi untuk ${selectedSub?.name}. Sisa: ${formatCurrency(remaining)}`,
        {
          description: `Anda mencoba mengajukan ${formatCurrency(numAmount)}, tetapi hanya tersisa ${formatCurrency(remaining)}`
        }
      )
      return
    }

    const selectedSub = selectedCategory?.subItems.find(s => s.id === subItemId)
    const allocatedBudget = selectedSub?.monthlyBudget || 0
    const usageAfter = allocatedBudget > 0 ? ((remaining - numAmount) / allocatedBudget) * 100 : 0
    if (usageAfter < 20 && remaining > 0) {
      toast.warning(
        'Peringatan: Anggaran akan hampir habis',
        {
          description: `Setelah pengajuan ini, sisa anggaran hanya ${formatCurrency(remaining - numAmount)}`
        }
      )
    }

    setIsSubmitting(true)
    const success = await onSubmit(categoryId, subItemId, numAmount, description, executionMonth)
    setIsSubmitting(false)

    if (success) {
      setCategoryId('')
      setSubItemId('')
      setAmount('')
      setDescription('')
      setExecutionMonth('')
      onOpenChange(false)
      toast.success('Pengajuan berhasil dibuat', {
        description: `${formatCurrency(numAmount)} telah dikurangkan dari ${selectedSub?.name}`
      })
    }
  }

  const selectedCategory = categories.find(c => c.id === categoryId)
  const remainingBudget = categoryId && subItemId ? getRemainingBudget(categoryId, subItemId) : 0
  const monthOptions = getMonthOptions()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Buat Pengajuan Baru</DialogTitle>
          <DialogDescription>
            Masukkan detail pengajuan anggaran. Pastikan kategori dan jumlah sudah benar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategori Program</Label>
              <Select value={categoryId} onValueChange={(val) => {
                setCategoryId(val)
                setSubItemId('')
              }}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategory && selectedCategory.subItems.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="subitem">Sub-Item Budget</Label>
                <Select value={subItemId} onValueChange={setSubItemId}>
                  <SelectTrigger id="subitem">
                    <SelectValue placeholder="Pilih sub-item" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory.subItems.map(subItem => (
                      <SelectItem key={subItem.id} value={subItem.id}>
                        {subItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedCategory && subItemId && (
              <div className="rounded-lg bg-muted p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sisa Anggaran</span>
                  <span className="font-display font-semibold tabular-nums text-success">
                    {formatCurrency(remainingBudget)}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah (IDR)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="1000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="execution-month">Estimasi Pelaksanaan</Label>
              <Select value={executionMonth} onValueChange={setExecutionMonth}>
                <SelectTrigger id="execution-month">
                  <SelectValue placeholder="Pilih bulan pelaksanaan" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map(month => (
                    <SelectItem key={month} value={month}>
                      {formatMonth(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Jelaskan tujuan pengajuan anggaran ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : 'Buat Pengajuan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
