import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BudgetCategory, MonthlyBudgetData } from '@/lib/budget-utils'
import { formatCurrency, formatMonth, calculateUsage } from '@/lib/budget-utils'
import { Calendar } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface YearlyViewProps {
  year: number
  categories: BudgetCategory[]
  monthlyData: { [month: string]: MonthlyBudgetData }
}

export function YearlyView({ year, categories, monthlyData }: YearlyViewProps) {
  const months = useMemo(() => {
    const monthList: string[] = []
    for (let i = 1; i <= 12; i++) {
      const month = String(i).padStart(2, '0')
      monthList.push(`${year}-${month}`)
    }
    return monthList
  }, [year])

  const yearlyStats = useMemo(() => {
    const stats = months.map(month => {
      const data = monthlyData[month]
      if (!data) {
        const totalAllocated = categories.reduce((sum, cat) => sum + cat.monthlyBudget, 0)
        return {
          month,
          allocated: totalAllocated,
          used: 0,
          percentage: 0,
          submissionCount: 0
        }
      }

      const totalAllocated = Object.values(data.categories).reduce((sum, cat) => sum + cat.allocated, 0)
      const totalUsed = Object.values(data.categories).reduce((sum, cat) => sum + cat.used, 0)
      const submissionCount = Object.values(data.categories).reduce((sum, cat) => sum + cat.submissions.length, 0)

      return {
        month,
        allocated: totalAllocated,
        used: totalUsed,
        percentage: calculateUsage(totalAllocated, totalUsed),
        submissionCount
      }
    })

    return stats
  }, [months, monthlyData, categories])

  const totalYearAllocated = yearlyStats.reduce((sum, stat) => sum + stat.allocated, 0)
  const totalYearUsed = yearlyStats.reduce((sum, stat) => sum + stat.used, 0)
  const yearlyPercentage = calculateUsage(totalYearAllocated, totalYearUsed)

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-destructive text-destructive-foreground'
    if (percentage >= 80) return 'bg-warning text-warning-foreground'
    if (percentage >= 70) return 'bg-warning/70 text-warning-foreground'
    return 'bg-success text-success-foreground'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Calendar size={24} weight="duotone" />
            Ringkasan Tahunan {year}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Alokasi</p>
              <p className="font-display text-2xl font-bold tabular-nums">
                {formatCurrency(totalYearAllocated)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Terpakai</p>
              <p className="font-display text-2xl font-bold tabular-nums text-primary">
                {formatCurrency(totalYearUsed)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Sisa</p>
              <p className="font-display text-2xl font-bold tabular-nums text-success">
                {formatCurrency(totalYearAllocated - totalYearUsed)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Penggunaan</p>
              <p className="font-display text-2xl font-bold tabular-nums">
                {yearlyPercentage}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {yearlyStats.map((stat, index) => (
          <motion.div
            key={stat.month}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-lg">
                    {formatMonth(stat.month)}
                  </CardTitle>
                  <Badge className={getStatusColor(stat.percentage)}>
                    {stat.percentage}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dialokasikan</span>
                    <span className="font-display font-semibold tabular-nums">
                      {formatCurrency(stat.allocated)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Terpakai</span>
                    <span className="font-display font-semibold tabular-nums text-primary">
                      {formatCurrency(stat.used)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sisa</span>
                    <span className="font-display font-semibold tabular-nums text-success">
                      {formatCurrency(stat.allocated - stat.used)}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full ${stat.percentage >= 100 ? 'bg-destructive' : stat.percentage >= 80 ? 'bg-warning' : 'bg-success'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stat.percentage, 100)}%` }}
                    transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                  />
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Pengajuan</span>
                    <Badge variant="outline" className="text-xs">
                      {stat.submissionCount}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
