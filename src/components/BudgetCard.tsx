import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, calculateUsage, getStatusColor } from '@/lib/budget-utils'
import { Wallet, TrendUp, TrendDown } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BudgetCardProps {
  categoryName: string
  allocated: number
  used: number
  submissionCount: number
  icon?: string
}

export function BudgetCard({ categoryName, allocated, used, submissionCount, icon }: BudgetCardProps) {
  const remaining = allocated - used
  const percentage = calculateUsage(allocated, used)
  const statusColor = getStatusColor(percentage)
  
  const getProgressColorClass = () => {
    if (percentage >= 100) return 'bg-destructive'
    if (percentage >= 80) return 'bg-warning'
    if (percentage >= 70) return 'bg-warning'
    return 'bg-success'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wallet className="text-primary" size={20} weight="duotone" />
              </div>
              <div>
                <CardTitle className="text-lg">{categoryName}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {submissionCount} pengajuan
                </p>
              </div>
            </div>
            <Badge 
              variant={statusColor === 'destructive' ? 'destructive' : statusColor === 'warning' ? 'secondary' : 'default'}
              className={statusColor === 'success' ? 'bg-success text-success-foreground' : ''}
            >
              {percentage}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Terpakai</span>
              <span className="font-display font-semibold tabular-nums">{formatCurrency(used)}</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
              <div 
                className={cn("h-full transition-all duration-500 ease-out", getProgressColorClass())}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Anggaran</span>
              <span className="font-display font-medium tabular-nums">{formatCurrency(allocated)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sisa Anggaran</span>
              <div className="flex items-center gap-2">
                {remaining >= 0 ? (
                  <TrendUp className="text-success" size={16} weight="bold" />
                ) : (
                  <TrendDown className="text-destructive" size={16} weight="bold" />
                )}
                <span className={`font-display font-bold text-lg tabular-nums ${remaining >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(Math.abs(remaining))}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
