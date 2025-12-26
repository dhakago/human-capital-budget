import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Warning, X } from '@phosphor-icons/react'
import { BudgetAlert } from '@/lib/budget-utils'
import { formatCurrency } from '@/lib/budget-utils'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface BudgetAlertsProps {
  alerts: BudgetAlert[]
  getCategoryName: (categoryId: string) => string
  onDismiss: (alertId: string) => void
}

export function BudgetAlerts({ alerts, getCategoryName, onDismiss }: BudgetAlertsProps) {
  if (alerts.length === 0) return null

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {alerts.map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Alert 
              className={`${alert.type === 'exceeded' ? 'border-destructive bg-destructive/10' : 'border-warning bg-warning/10'}`}
            >
              <div className="flex items-start gap-3">
                <Warning 
                  className={alert.type === 'exceeded' ? 'text-destructive' : 'text-warning-foreground'} 
                  size={20} 
                  weight="fill" 
                />
                <div className="flex-1">
                  <AlertTitle className="font-display font-semibold">
                    {alert.type === 'exceeded' ? 'Anggaran Terlampaui!' : 'Perhatian: Anggaran Hampir Habis'}
                  </AlertTitle>
                  <AlertDescription className="mt-1">
                    <strong>{getCategoryName(alert.categoryId)}</strong> telah mencapai{' '}
                    <strong>{alert.percentage}%</strong> dari anggaran bulanan.{' '}
                    {alert.type === 'exceeded' 
                      ? 'Pengajuan baru untuk kategori ini tidak dapat diproses.'
                      : 'Harap berhati-hati dalam membuat pengajuan baru.'}
                  </AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => onDismiss(alert.id)}
                >
                  <X size={16} />
                </Button>
              </div>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
