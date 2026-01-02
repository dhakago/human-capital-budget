import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BudgetCategory, BudgetSubItem, formatCurrency, formatMonth, calculateUsage, getStatusColor } from '@/lib/budget-utils'
import { ArrowLeft, Pencil, Plus, Clock, FileText } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CategoryDetailViewProps {
  category: BudgetCategory
  categoryData: {
    allocated: number
    used: number
    subItems: {
      [subItemId: string]: {
        allocated: number
        used: number
        submissions: any[]
      }
    }
  }
  onBack: () => void
  onEdit: () => void
  onAddSubmission: (subItemId: string) => void
  isLocked?: boolean
  canEdit?: boolean
}

export function CategoryDetailView({ 
  category, 
  categoryData, 
  onBack, 
  onEdit,
  onAddSubmission,
  isLocked = false,
  canEdit = false
}: CategoryDetailViewProps) {
  const [selectedSubItem, setSelectedSubItem] = useState<{ subItem: BudgetSubItem; subData: any } | null>(null)
  
  const percentage = calculateUsage(categoryData.allocated, categoryData.used)
  const statusColor = getStatusColor(percentage)
  const remaining = categoryData.allocated - categoryData.used

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const subItemList = category.subItems.map((subItem) => {
    const subData = categoryData.subItems[subItem.id] || { allocated: subItem.monthlyBudget, used: 0, submissions: [] }
    return { subItem, subData }
  })

  const allowEdit = canEdit && !isLocked

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft size={16} />
          Kembali
        </Button>
        {allowEdit && (
          <Button variant="outline" onClick={onEdit} className="gap-2">
            <Pencil size={16} />
            Edit Kategori
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-display">{category.name}</CardTitle>
              <p className="text-muted-foreground mt-1">{category.subItems.length} sub-item budget</p>
            </div>
            <Badge 
              variant={statusColor === 'destructive' ? 'destructive' : statusColor === 'warning' ? 'outline' : 'default'}
              className={statusColor === 'success' ? 'bg-success text-success-foreground' : ''}
            >
              {percentage}% Terpakai
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Anggaran</p>
              <p className="text-2xl font-semibold font-display tabular-nums">{formatCurrency(categoryData.allocated)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Terpakai</p>
              <p className="text-2xl font-semibold font-display tabular-nums">{formatCurrency(categoryData.used)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sisa</p>
              <p className="text-2xl font-semibold font-display tabular-nums">{formatCurrency(remaining)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Penggunaan Budget</span>
              <span className="font-medium">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-display text-lg font-semibold mb-4">Detail Sub-Item Budget</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subItemList.map(({ subItem, subData }) => {
            const subPercentage = calculateUsage(subData.allocated, subData.used)
            const subStatusColor = getStatusColor(subPercentage)
            const subRemaining = subData.allocated - subData.used

            return (
              <Card 
                key={subItem.id} 
                className="hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                onClick={() => setSelectedSubItem({ subItem, subData })}
              >
                <CardHeader className="pb-3 min-h-[3rem]">
                  <CardTitle className="text-sm font-medium line-clamp-2">{subItem.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <div className="space-y-2 min-h-[80px]">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Anggaran</span>
                      <span className="font-medium tabular-nums">{formatCurrency(subData.allocated)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Terpakai</span>
                      <span className="font-medium tabular-nums">{formatCurrency(subData.used)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Sisa</span>
                      <span className="font-semibold tabular-nums">{formatCurrency(subRemaining)}</span>
                    </div>
                  </div>

                  <div className="space-y-1 min-h-[40px]">
                    <Progress value={subPercentage} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{subPercentage}% terpakai</span>
                      <Badge 
                        variant={subStatusColor === 'destructive' ? 'destructive' : 'outline'}
                        className={`text-xs ${subStatusColor === 'success' ? 'bg-success/10 text-success border-success/20' : subStatusColor === 'warning' ? 'bg-warning/10 text-warning border-warning/20' : ''}`}
                      >
                        {subData.submissions.length} pengajuan
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    {allowEdit && (
                      <Button 
                        size="sm" 
                        className="flex-1 gap-2" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          onAddSubmission(subItem.id)
                        }}
                      >
                        <Plus size={14} weight="bold" />
                        Buat Pengajuan
                      </Button>
                    )}
                    {subData.submissions.length > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedSubItem({ subItem, subData })
                        }}
                      >
                        <FileText size={14} />
                        Lihat
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <Dialog open={!!selectedSubItem} onOpenChange={(open) => !open && setSelectedSubItem(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          {selectedSubItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-display">{selectedSubItem.subItem.name}</DialogTitle>
                <DialogDescription>
                  Detail anggaran dan riwayat pengajuan
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-xs text-muted-foreground">Anggaran</p>
                    <p className="text-lg font-semibold font-display tabular-nums">{formatCurrency(selectedSubItem.subData.allocated)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Terpakai</p>
                    <p className="text-lg font-semibold font-display tabular-nums">{formatCurrency(selectedSubItem.subData.used)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sisa</p>
                    <p className="text-lg font-semibold font-display tabular-nums">{formatCurrency(selectedSubItem.subData.allocated - selectedSubItem.subData.used)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Penggunaan</span>
                    <span className="font-medium">{calculateUsage(selectedSubItem.subData.allocated, selectedSubItem.subData.used)}%</span>
                  </div>
                  <Progress value={calculateUsage(selectedSubItem.subData.allocated, selectedSubItem.subData.used)} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">Riwayat Pengajuan</h4>
                    <Badge variant="outline">{selectedSubItem.subData.submissions.length} pengajuan</Badge>
                  </div>
                  
                  {selectedSubItem.subData.submissions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Belum ada pengajuan untuk sub-item ini.
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-3">
                        {selectedSubItem.subData.submissions.map((submission: any) => (
                          <Card key={submission.id} className="bg-muted/30">
                            <CardContent className="py-3 space-y-2">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold font-display tabular-nums text-lg">{formatCurrency(submission.amount)}</span>
                                    <Badge 
                                      variant={submission.status === 'approved' ? 'default' : submission.status === 'pending' ? 'secondary' : 'destructive'}
                                      className="text-xs"
                                    >
                                      {submission.status === 'approved' ? 'Disetujui' : submission.status === 'pending' ? 'Pending' : 'Ditolak'}
                                    </Badge>
                                  </div>
                                  <p className="text-sm mb-2">{submission.description}</p>
                                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock size={12} />
                                      {formatDate(submission.date)}
                                    </span>
                                    <span>
                                      Pelaksanaan: {submission.executionMonth ? formatMonth(submission.executionMonth) : '-'}
                                    </span>
                                    {submission.evidence && (
                                      <span className="flex items-center gap-1">
                                        <FileText size={12} />
                                        {submission.evidence.fileName}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
