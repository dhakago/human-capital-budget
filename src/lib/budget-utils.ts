export interface BudgetSubItem {
  id: string
  name: string
  monthlyBudget: number
}

export interface BudgetCategory {
  id: string
  name: string
  monthlyBudget: number
  icon?: string
  subItems: BudgetSubItem[]
}

export interface Submission {
  id: string
  categoryId: string
  subItemId?: string
  amount: number
  description: string
  date: string
  executionMonth: string
  status: 'approved' | 'pending' | 'rejected'
  evidence: {
    fileName: string
    fileSize: number
    fileType: string
    uploadDate: string
  }
}

export interface MonthlyBudgetData {
  month: string
  categories: {
    [categoryId: string]: {
      allocated: number
      used: number
      submissions: Submission[]
      subItems: {
        [subItemId: string]: {
          allocated: number
          used: number
          submissions: Submission[]
        }
      }
    }
  }
}

export interface BudgetAlert {
  id: string
  categoryId: string
  type: 'warning' | 'exceeded'
  message: string
  percentage: number
}

export const formatCurrency = (amount: number): string => {
  const formatted = Math.abs(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `Rp ${amount < 0 ? '-' : ''}${formatted}`
}

export const formatMonth = (monthStr: string): string => {
  const date = new Date(monthStr + '-01')
  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric'
  }).format(date)
}

export const getCurrentMonth = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export const getMonthOptions = (): string[] => {
  const options: string[] = []
  const currentDate = new Date()
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    options.push(`${year}-${month}`)
  }
  
  for (let i = 1; i <= 6; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    options.push(`${year}-${month}`)
  }
  
  return options
}

export const getYearMonths = (year: number): string[] => {
  const months: string[] = []
  for (let i = 1; i <= 12; i++) {
    const month = String(i).padStart(2, '0')
    months.push(`${year}-${month}`)
  }
  return months
}

export const calculateUsage = (allocated: number, used: number): number => {
  if (allocated === 0) return 0
  return Math.round((used / allocated) * 100)
}

export const getStatusColor = (percentage: number): string => {
  if (percentage >= 100) return 'destructive'
  if (percentage >= 80) return 'warning'
  if (percentage >= 70) return 'warning'
  return 'success'
}
