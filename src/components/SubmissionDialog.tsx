import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BudgetCategory } from '@/lib/budget-utils'
import { formatCurrency } from '@/lib/budget-utils'
import { toast } from 'sonner'

interface SubmissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: BudgetCategory[]
  onSubmit: (categoryId: string, amount: number, description: string) => Promise<boolean>
  getRemainingBudget: (categoryId: string) => number
}

export function SubmissionDialog({ open, onOpenChange, categories, onSubmit, getRemainingBudget }: SubmissionDialogProps) {
  const [categoryId, setCategoryId] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!categoryId || !amount || !description) {
      toast.error('Mohon lengkapi semua field')
      return
    }

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Jumlah harus lebih dari 0')
      return
    }

    const remaining = getRemainingBudget(categoryId)
    
    if (numAmount > remaining) {
      const selectedCat = categories.find(c => c.id === categoryId)
      toast.error(
        `Anggaran tidak mencukupi untuk ${selectedCat?.name}. Sisa: ${formatCurrency(remaining)}`,
        {
          description: `Anda mencoba mengajukan ${formatCurrency(numAmount)}, tetapi hanya tersisa ${formatCurrency(remaining)}`
        }
      )
      return
    }

    const usageAfter = ((getRemainingBudget(categoryId) - numAmount) / selectedCategory!.monthlyBudget) * 100
    if (usageAfter < 20 && remaining > 0) {
      toast.warning(
        'Peringatan: Anggaran akan hampir habis',
        {
          description: `Setelah pengajuan ini, sisa anggaran hanya ${formatCurrency(remaining - numAmount)}`
        }
      )
    }

    setIsSubmitting(true)
    const success = await onSubmit(categoryId, numAmount, description)
    setIsSubmitting(false)

    if (success) {
      setCategoryId('')
      setAmount('')
      setDescription('')
      onOpenChange(false)
      toast.success('Pengajuan berhasil dibuat', {
        description: `${formatCurrency(numAmount)} telah dikurangkan dari ${selectedCategory?.name}`
      })
    }
  }

  const selectedCategory = categories.find(c => c.id === categoryId)
  const remainingBudget = categoryId ? getRemainingBudget(categoryId) : 0

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
              <Select value={categoryId} onValueChange={setCategoryId}>
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

            {selectedCategory && (
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
