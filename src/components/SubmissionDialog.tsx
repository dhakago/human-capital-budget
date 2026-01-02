import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BudgetCategory } from '@/lib/budget-utils'
import { formatCurrency, formatMonth } from '@/lib/budget-utils'
import { toast } from 'sonner'
import { UploadSimple, File } from '@phosphor-icons/react'

interface SubmissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: BudgetCategory[]
  onSubmit: (categoryId: string, subItemId: string | undefined, amount: number, description: string, executionMonth: string, evidence: { fileName: string; fileSize: number; fileType: string; uploadDate: string }) => Promise<boolean>
  getRemainingBudget: (categoryId: string, subItemId?: string) => number
  preSelectedCategory?: string
  preSelectedSubItem?: string
  canSubmit: boolean
}

export function SubmissionDialog({ 
  open, 
  onOpenChange, 
  categories, 
  onSubmit, 
  getRemainingBudget,
  preSelectedCategory,
  preSelectedSubItem,
  canSubmit
}: SubmissionDialogProps) {
  const [categoryId, setCategoryId] = useState('')
  const [subItemId, setSubItemId] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [executionDay, setExecutionDay] = useState('')
  const [executionMonth, setExecutionMonth] = useState('')
  const [executionYear, setExecutionYear] = useState('')
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)
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

    if (!canSubmit) {
      toast.error('Hanya superadmin yang dapat membuat pengajuan')
      return
    }
    
    if (!categoryId || !amount || !description || !executionDay || !executionMonth || !executionYear) {
      toast.error('Mohon lengkapi semua field')
      return
    }

    const executionDate = `${executionYear}-${executionMonth}-${executionDay}`

    const parsedDate = new Date(executionDate)
    if (isNaN(parsedDate.getTime())) {
      toast.error('Tanggal pelaksanaan tidak valid')
      return
    }

    if (!subItemId) {
      toast.error('Mohon pilih sub-item')
      return
    }

    if (!evidenceFile) {
      toast.error('Mohon lampirkan bukti/evidence')
      return
    }

    const numAmount = parseInt(amount.replace(/\./g, ''), 10)
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

    const evidence = {
      fileName: evidenceFile.name,
      fileSize: evidenceFile.size,
      fileType: evidenceFile.type,
      uploadDate: new Date().toISOString()
    }

    setIsSubmitting(true)
    const success = await onSubmit(categoryId, subItemId, numAmount, description, executionDate, evidence)
    setIsSubmitting(false)

    if (success) {
      setCategoryId('')
      setSubItemId('')
      setAmount('')
      setDescription('')
      setExecutionDay('')
      setExecutionMonth('')
      setExecutionYear('')
      setEvidenceFile(null)
      onOpenChange(false)
      toast.success('Pengajuan berhasil dibuat', {
        description: `${formatCurrency(numAmount)} telah dikurangkan dari ${selectedSub?.name}`
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error('Ukuran file terlalu besar', {
          description: 'Maksimal ukuran file adalah 10MB'
        })
        return
      }
      setEvidenceFile(file)
    }
  }

  const selectedCategory = categories.find(c => c.id === categoryId)
  const remainingBudget = categoryId && subItemId ? getRemainingBudget(categoryId, subItemId) : 0
  const yearOptions = Array.from({ length: 5 }, (_, i) => `${new Date().getFullYear() - 1 + i}`)

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  const monthNames = Array.from({ length: 12 }, (_, idx) =>
    new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(2000, idx, 1))
  )

  const parsedYear = Number(executionYear || new Date().getFullYear())
  const parsedMonth = Number(executionMonth || new Date().getMonth() + 1)
  const daysInMonth = getDaysInMonth(parsedYear, parsedMonth)
  const dayOptions = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`.padStart(2, '0'))

  useEffect(() => {
    if (executionDay && !dayOptions.includes(executionDay)) {
      setExecutionDay('')
    }
  }, [executionMonth, executionYear])

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
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '')
                  setAmount(raw ? Number(raw).toLocaleString('id-ID') : '')
                }}
              />
            </div>

            <div className="space-y-1">
              <Label>Waktu Pelaksanaan</Label>
              <div className="grid grid-flow-col auto-cols-max gap-2">
                <Select value={executionDay} onValueChange={setExecutionDay}>
                  <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Tanggal" />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOptions.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={executionMonth} onValueChange={setExecutionMonth}>
                  <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((name, idx) => {
                      const month = `${(idx + 1).toString().padStart(2, '0')}`
                      return (
                        <SelectItem key={month} value={month}>
                          {name}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>

                <Select value={executionYear} onValueChange={setExecutionYear}>
                  <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

            <div className="space-y-2">
              <Label htmlFor="evidence">Bukti/Evidence <span className="text-destructive">*</span></Label>
              <div className="relative">
                <input
                  id="evidence"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start gap-2 h-auto py-3"
                  onClick={() => document.getElementById('evidence')?.click()}
                >
                  {evidenceFile ? (
                    <>
                      <File size={20} weight="duotone" className="text-primary" />
                      <div className="flex-1 text-left overflow-hidden">
                        <p className="text-sm font-medium truncate">{evidenceFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(evidenceFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <UploadSimple size={20} weight="duotone" />
                      <span className="text-muted-foreground">Pilih file bukti...</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Format: PDF, Gambar, Word, Excel (Max. 10MB)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting || !canSubmit}>
              {isSubmitting ? 'Memproses...' : 'Buat Pengajuan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
