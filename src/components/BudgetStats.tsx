import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BudgetCategory, MonthlyBudgetData, calculateUsage } from '@/lib/budget-utils'
import { ChartPie } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface BudgetStatsProps {
  categories: BudgetCategory[]
  currentMonthData: MonthlyBudgetData
}

export function BudgetStats({ categories, currentMonthData }: BudgetStatsProps) {
  const stats = categories.reduce((acc, cat) => {
    const data = currentMonthData.categories[cat.id] || { allocated: cat.monthlyBudget, used: 0, submissions: [] }
    const percentage = calculateUsage(data.allocated, data.used)
    
    if (percentage >= 100) {
      acc.exceeded++
    } else if (percentage >= 80) {
      acc.warning++
    } else if (percentage >= 50) {
      acc.moderate++
    } else {
      acc.healthy++
    }
    
    return acc
  }, { healthy: 0, moderate: 0, warning: 0, exceeded: 0 })

  const total = categories.length
  const statItems = [
    { 
      label: 'Sehat', 
      count: stats.healthy, 
      percentage: (stats.healthy / total) * 100,
      barColor: 'bg-success',
      textColor: 'text-success',
      description: '< 50% terpakai'
    },
    { 
      label: 'Moderat', 
      count: stats.moderate, 
      percentage: (stats.moderate / total) * 100,
      barColor: 'bg-primary',
      textColor: 'text-primary',
      description: '50-80% terpakai'
    },
    { 
      label: 'Peringatan', 
      count: stats.warning, 
      percentage: (stats.warning / total) * 100,
      barColor: 'bg-warning',
      textColor: 'text-warning-foreground',
      description: '80-100% terpakai'
    },
    { 
      label: 'Terlampaui', 
      count: stats.exceeded, 
      percentage: (stats.exceeded / total) * 100,
      barColor: 'bg-destructive',
      textColor: 'text-destructive',
      description: '> 100% terpakai'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2">
          <ChartPie size={24} weight="duotone" />
          Status Kategori Anggaran
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {statItems.map(item => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <span className={cn("font-display font-semibold tabular-nums", item.textColor)}>
                {item.count}
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
              <div 
                className={cn("h-full transition-all duration-500", item.barColor)}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
        <div className="pt-3 border-t border-border text-sm text-muted-foreground">
          <p>Total: {total} kategori program</p>
        </div>
      </CardContent>
    </Card>
  )
}
