import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Submission } from '@/lib/budget-utils'
import { formatCurrency } from '@/lib/budget-utils'
import { ListBullets } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

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
        <CardTitle className="font-display flex items-center gap-2">
          <ListBullets size={24} weight="duotone" />
          Riwayat Pengajuan
        </CardTitle>
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
