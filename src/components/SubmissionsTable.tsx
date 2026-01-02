import { useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Submission, BudgetCategory } from '@/lib/budget-utils'
import { formatCurrency, formatMonth } from '@/lib/budget-utils'
import { ListBullets, Download, File, FunnelSimple, XCircle, SquaresFour } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface SubmissionsTableProps {
  submissions: Submission[]
  categories: BudgetCategory[]
  getCategoryName: (categoryId: string) => string
}

export function SubmissionsTable({ submissions, categories, getCategoryName }: SubmissionsTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Submission['status']>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [monthFilter, setMonthFilter] = useState<string>('all')
  const [groupByMonth, setGroupByMonth] = useState<boolean>(false)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStatusBadge = (status: Submission['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success text-success-foreground">Disetujui</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'rejected':
        return <Badge variant="destructive">Ditolak</Badge>
    }
  }

  const handleExport = () => {
    const headers = ['Tanggal', 'Kategori', 'Deskripsi', 'Jumlah (IDR)', 'Estimasi Pelaksanaan', 'Status', 'Bukti']
    const rows = filteredSubmissions.map(sub => [
      formatDate(sub.date),
      getCategoryName(sub.categoryId),
      sub.description,
      sub.amount.toString(),
      formatMonth(sub.executionMonth),
      sub.status === 'approved' ? 'Disetujui' : sub.status === 'pending' ? 'Pending' : 'Ditolak',
      sub.evidence.fileName
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `pengajuan_budget_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Data berhasil diekspor', {
      description: `${filteredSubmissions.length} pengajuan telah diunduh`
    })
  }

  const monthOptions = useMemo(() => {
    const set = new Set<string>()
    submissions.forEach(s => set.add(s.executionMonth))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [submissions])

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      if (statusFilter !== 'all' && sub.status !== statusFilter) return false
      if (categoryFilter !== 'all' && sub.categoryId !== categoryFilter) return false
      if (monthFilter !== 'all' && sub.executionMonth !== monthFilter) return false

      if (search.trim()) {
        const q = search.toLowerCase()
        const catName = getCategoryName(sub.categoryId).toLowerCase()
        const dateStr = formatDate(sub.date).toLowerCase()
        const execMonth = formatMonth(sub.executionMonth).toLowerCase()
        return (
          sub.description.toLowerCase().includes(q) ||
          catName.includes(q) ||
          execMonth.includes(q) ||
          sub.evidence.fileName.toLowerCase().includes(q) ||
          dateStr.includes(q)
        )
      }
      return true
    })
  }, [submissions, statusFilter, categoryFilter, monthFilter, search, getCategoryName])

  const grouped = useMemo(() => {
    if (!groupByMonth) return []
    const groups: { label: string; month: string; items: Submission[] }[] = []
    const map = new Map<string, Submission[]>()
    filteredSubmissions.forEach((sub) => {
      if (!map.has(sub.executionMonth)) map.set(sub.executionMonth, [])
      map.get(sub.executionMonth)!.push(sub)
    })
    Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .forEach(([month, items]) => {
        groups.push({ label: formatMonth(month), month, items })
      })
    return groups
  }, [filteredSubmissions, groupByMonth])

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setCategoryFilter('all')
    setMonthFilter('all')
  }

  const hasNoData = submissions.length === 0
  const hasNoResults = !hasNoData && filteredSubmissions.length === 0

  if (hasNoData) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-muted">
              <ListBullets size={32} className="text-muted-foreground" weight="duotone" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg">Belum Ada Pengajuan</h3>
              <p className="text-muted-foreground mt-1">
                Mulai buat pengajuan anggaran untuk bulan ini
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="font-display flex items-center gap-2">
            <ListBullets size={24} weight="duotone" />
            Riwayat Pengajuan
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={groupByMonth ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGroupByMonth((v) => !v)}
              className="gap-2"
            >
              <SquaresFour size={16} weight="bold" />
              {groupByMonth ? 'Group per Bulan' : 'Tanpa Group'}
            </Button>
            {filteredSubmissions.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport}
                className="gap-2"
              >
                <Download size={16} weight="bold" />
                Export CSV
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
          <div className="w-full md:max-w-sm">
            <Input
              placeholder="Cari deskripsi, kategori, bulan, bukti..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={monthFilter} onValueChange={(v) => setMonthFilter(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Bulan pelaksanaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Bulan</SelectItem>
                {monthOptions.map((m) => (
                  <SelectItem key={m} value={m}>{formatMonth(m)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={resetFilters}
            >
              <XCircle size={16} />
              Reset
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <FunnelSimple size={16} />
          <span>{filteredSubmissions.length} dari {submissions.length} pengajuan</span>
        </div>

        {hasNoResults && (
          <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
            Tidak ada pengajuan yang cocok dengan filter.
          </div>
        )}

        {!hasNoResults && (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Estimasi Pelaksanaan</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-center">Bukti</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(groupByMonth ? grouped.flatMap((group, gi) => [
                <TableRow key={`group-${group.month}`} className="bg-muted/40">
                  <TableCell colSpan={7} className="font-semibold text-primary">
                    {group.label}
                  </TableCell>
                </TableRow>,
                ...group.items.map((submission, index) => (
                  <motion.tr
                    key={submission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + gi * 0.02 }}
                    className="border-b border-border last:border-0"
                  >
                    <TableCell className="font-medium text-sm">
                      {formatDate(submission.date)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getCategoryName(submission.categoryId)}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {submission.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium">
                        {formatMonth(submission.executionMonth)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-display font-semibold tabular-nums">
                      {formatCurrency(submission.amount)}
                    </TableCell>
                    <TableCell className="text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <File size={16} weight="duotone" className="text-primary" />
                              <span className="text-xs max-w-[100px] truncate">{submission.evidence.fileName}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="font-medium">{submission.evidence.fileName}</p>
                              <p className="text-xs text-muted-foreground">
                                Ukuran: {(submission.evidence.fileSize / 1024).toFixed(2)} KB
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Tipe: {submission.evidence.fileType}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(submission.status)}
                    </TableCell>
                  </motion.tr>
                ))
              ]) : filteredSubmissions.map((submission, index) => (
                <motion.tr
                  key={submission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border last:border-0"
                >
                  <TableCell className="font-medium text-sm">
                    {formatDate(submission.date)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryName(submission.categoryId)}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {submission.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium">
                      {formatMonth(submission.executionMonth)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-display font-semibold tabular-nums">
                    {formatCurrency(submission.amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <File size={16} weight="duotone" className="text-primary" />
                            <span className="text-xs max-w-[100px] truncate">{submission.evidence.fileName}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-medium">{submission.evidence.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              Ukuran: {(submission.evidence.fileSize / 1024).toFixed(2)} KB
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Tipe: {submission.evidence.fileType}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(submission.status)}
                  </TableCell>
                </motion.tr>
              )))}
            </TableBody>
          </Table>
        </div>
        )}
      </CardContent>
    </Card>
  )
}
