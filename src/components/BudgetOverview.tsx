import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/budget-utils'
import { Wallet, TrendUp, TrendDown, ChartLineUp } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface BudgetOverviewProps {
  totalAllocated: number
  totalUsed: number
  totalRemaining: number
  categoryCount: number
}

export function BudgetOverview({ totalAllocated, totalUsed, totalRemaining, categoryCount }: BudgetOverviewProps) {
  const usagePercentage = totalAllocated > 0 ? Math.round((totalUsed / totalAllocated) * 100) : 0

  const topRowStats = [
    {
      title: 'Total Anggaran',
      value: totalAllocated,
      icon: Wallet,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Sisa Anggaran',
      value: totalRemaining,
      icon: TrendUp,
      color: totalRemaining >= 0 ? 'text-success' : 'text-destructive',
      bgColor: totalRemaining >= 0 ? 'bg-success/10' : 'bg-destructive/10'
    }
  ]

  const bottomRowStats = [
    {
      title: 'Terpakai',
      value: totalUsed,
      icon: TrendDown,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      showPercentage: true
    },
    {
      title: 'Kategori Program',
      value: categoryCount,
      icon: ChartLineUp,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      isCount: true
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {topRowStats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="h-full"
        >
          <Card className="h-full hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                  <p className="font-display font-bold text-2xl tabular-nums">
                    {formatCurrency(stat.value as number)}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={stat.color} size={24} weight="duotone" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      {bottomRowStats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (index + 2) * 0.1 }}
          className="h-full"
        >
          <Card className="h-full hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                  <p className="font-display font-bold text-2xl tabular-nums">
                    {stat.isCount ? stat.value : formatCurrency(stat.value as number)}
                  </p>
                  {stat.showPercentage && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {usagePercentage}% dari total
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={stat.color} size={24} weight="duotone" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
