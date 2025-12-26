import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Submission } from '@/lib/budget-utils'
import { formatCurrency } from '@/lib/budget-utils'
import { ListBullets, Download } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface SubmissionsTableProps {
  submissions: Submission[]
  getCategoryName: (categoryId: string) => string
}

export function SubmissionsTable({ submissions, getCategoryName }: SubmissionsTableProps) {
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
    const headers = ['Tanggal', 'Kategori', 'Deskripsi', 'Jumlah (IDR)', 'Status']
    const rows = submissions.map(sub => [
      formatDate(sub.date),
      getCategoryName(sub.categoryId),
      sub.description,
      sub.amount.toString(),
      sub.status === 'approved' ? 'Disetujui' : sub.status === 'pending' ? 'Pending' : 'Ditolak'
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
      description: `${submissions.length} pengajuan telah diunduh`
    })
  }

  if (submissions.length === 0) {
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
        <div className="flex items-center justify-between">
          <CardTitle className="font-display flex items-center gap-2">
            <ListBullets size={24} weight="duotone" />
            Riwayat Pengajuan
          </CardTitle>
          {submissions.length > 0 && (
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
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission, index) => (
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
                  <TableCell className="text-right font-display font-semibold tabular-nums">
                    {formatCurrency(submission.amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(submission.status)}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
