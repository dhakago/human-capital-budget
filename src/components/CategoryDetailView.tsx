import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BudgetCategory, BudgetSubItem, formatCurrency, calculateUsage, getStatusColor } from '@/lib/budget-utils'
import { ArrowLeft, Pencil, Plus } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

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
}

export function CategoryDetailView({ 
  category, 
  categoryData, 
  onBack, 
  onEdit,
  onAddSubmission,
  isLocked = false
}: CategoryDetailViewProps) {
  const percentage = calculateUsage(categoryData.allocated, categoryData.used)
  const statusColor = getStatusColor(percentage)
  const remaining = categoryData.allocated - categoryData.used

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft size={16} />
          Kembali
        </Button>
        {!isLocked && (
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
          {category.subItems.map((subItem) => {
            const subData = categoryData.subItems[subItem.id] || { allocated: subItem.monthlyBudget, used: 0, submissions: [] }
            const subPercentage = calculateUsage(subData.allocated, subData.used)
            const subStatusColor = getStatusColor(subPercentage)
            const subRemaining = subData.allocated - subData.used

            return (
              <Card key={subItem.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium line-clamp-2">{subItem.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
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

                  <div className="space-y-1">
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

                  <Button 
                    size="sm" 
                    className="w-full gap-2" 
                    variant="outline"
                    onClick={() => onAddSubmission(subItem.id)}
                  >
                    <Plus size={14} weight="bold" />
                    Buat Pengajuan
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
