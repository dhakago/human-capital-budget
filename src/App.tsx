import { useState, useEffect, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BudgetCard } from '@/components/BudgetCard'
import { BudgetOverview } from '@/components/BudgetOverview'
import { BudgetStats } from '@/components/BudgetStats'
import { SubmissionDialog } from '@/components/SubmissionDialog'
import { BudgetAlerts } from '@/components/BudgetAlerts'
import { SubmissionsTable } from '@/components/SubmissionsTable'
import { Plus, Calendar, ChartBar, ListBullets, ArrowLeft, ArrowRight, MagnifyingGlass } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'
import { 
  BudgetCategory, 
  Submission, 
  MonthlyBudgetData, 
  BudgetAlert,
  getCurrentMonth, 
  getMonthOptions, 
  formatMonth,
  calculateUsage
} from '@/lib/budget-utils'
import { BUDGET_CATEGORIES_2026 } from '@/lib/seed-data'

function App() {
  const [categories, setCategories] = useKV<BudgetCategory[]>('budget-categories', [])
  const [monthlyData, setMonthlyData] = useKV<{ [month: string]: MonthlyBudgetData }>('monthly-budget-data', {})
  const [dismissedAlerts, setDismissedAlerts] = useKV<string[]>('dismissed-alerts', [])
  
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'warning' | 'exceeded'>('all')

  useEffect(() => {
    if (!categories || categories.length === 0) {
      setCategories(BUDGET_CATEGORIES_2026)
    }
  }, [])

  const monthOptions = getMonthOptions()

  const currentMonthData = useMemo(() => {
    const data = monthlyData || {}
    const cats = categories || []
    
    if (!data[selectedMonth]) {
      const newMonthData: MonthlyBudgetData = {
        month: selectedMonth,
        categories: {}
      }
      cats.forEach(cat => {
        newMonthData.categories[cat.id] = {
          allocated: cat.monthlyBudget,
          used: 0,
          submissions: []
        }
      })
      return newMonthData
    }
    return data[selectedMonth]
  }, [monthlyData, selectedMonth, categories])

  const alerts = useMemo(() => {
    const alertList: BudgetAlert[] = []
    const dismissed = dismissedAlerts || []
    
    Object.entries(currentMonthData.categories).forEach(([categoryId, data]) => {
      const percentage = calculateUsage(data.allocated, data.used)
      const alertId = `${selectedMonth}-${categoryId}-${percentage >= 100 ? 'exceeded' : 'warning'}`
      
      if (dismissed.includes(alertId)) return
      
      if (percentage >= 100) {
        alertList.push({
          id: alertId,
          categoryId,
          type: 'exceeded',
          message: 'Budget exceeded',
          percentage
        })
      } else if (percentage >= 80) {
        alertList.push({
          id: alertId,
          categoryId,
          type: 'warning',
          message: 'Budget warning',
          percentage
        })
      }
    })
    return alertList
  }, [currentMonthData, selectedMonth, dismissedAlerts])

  const allSubmissions = useMemo(() => {
    const submissions: Submission[] = []
    Object.values(currentMonthData.categories).forEach(data => {
      submissions.push(...data.submissions)
    })
    return submissions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [currentMonthData])

  const handleSubmission = async (categoryId: string, amount: number, description: string): Promise<boolean> => {
    const cats = categories || []
    
    const newSubmission: Submission = {
      id: `sub-${Date.now()}`,
      categoryId,
      amount,
      description,
      date: new Date().toISOString(),
      status: 'approved'
    }

    setMonthlyData((current) => {
      const updated = { ...(current || {}) }
      if (!updated[selectedMonth]) {
        updated[selectedMonth] = {
          month: selectedMonth,
          categories: {}
        }
        cats.forEach(cat => {
          updated[selectedMonth].categories[cat.id] = {
            allocated: cat.monthlyBudget,
            used: 0,
            submissions: []
          }
        })
      }

      const categoryData = updated[selectedMonth].categories[categoryId]
      if (!categoryData) return updated

      categoryData.submissions = [...categoryData.submissions, newSubmission]
      categoryData.used = categoryData.submissions.reduce((sum, sub) => sum + sub.amount, 0)

      return updated
    })

    return true
  }

  const getRemainingBudget = (categoryId: string): number => {
    const data = currentMonthData.categories[categoryId]
    if (!data) return 0
    return data.allocated - data.used
  }

  const getCategoryName = (categoryId: string): string => {
    const cats = categories || []
    const category = cats.find(c => c.id === categoryId)
    return category?.name || 'Unknown'
  }

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts((current) => [...(current || []), alertId])
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const currentIndex = monthOptions.indexOf(selectedMonth)
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedMonth(monthOptions[currentIndex - 1])
    } else if (direction === 'next' && currentIndex < monthOptions.length - 1) {
      setSelectedMonth(monthOptions[currentIndex + 1])
    }
  }

  const totalAllocated = (categories || []).reduce((sum, cat) => sum + cat.monthlyBudget, 0)
  const totalUsed = Object.values(currentMonthData.categories).reduce((sum, data) => sum + data.used, 0)
  const totalRemaining = totalAllocated - totalUsed

  const filteredCategories = useMemo(() => {
    const cats = categories || []
    
    let filtered = cats
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(cat => 
        cat.name.toLowerCase().includes(query) ||
        cat.id.toLowerCase().includes(query)
      )
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(cat => {
        const data = currentMonthData.categories[cat.id] || { allocated: cat.monthlyBudget, used: 0, submissions: [] }
        const percentage = calculateUsage(data.allocated, data.used)
        
        if (statusFilter === 'exceeded') return percentage >= 100
        if (statusFilter === 'warning') return percentage >= 80 && percentage < 100
        if (statusFilter === 'healthy') return percentage < 80
        return true
      })
    }
    
    return filtered
  }, [categories, searchQuery, statusFilter, currentMonthData])

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">Budget HCGA 2026</h1>
              <p className="text-muted-foreground mt-1">Human Capital & General Affairs</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth('prev')}
                  disabled={monthOptions.indexOf(selectedMonth) === 0}
                >
                  <ArrowLeft size={16} />
                </Button>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[200px]">
                    <Calendar size={16} className="mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map(month => (
                      <SelectItem key={month} value={month}>
                        {formatMonth(month)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth('next')}
                  disabled={monthOptions.indexOf(selectedMonth) === monthOptions.length - 1}
                >
                  <ArrowRight size={16} />
                </Button>
              </div>
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus size={16} weight="bold" />
                Buat Pengajuan
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {alerts.length > 0 && (
          <div className="mb-6">
            <BudgetAlerts 
              alerts={alerts} 
              getCategoryName={getCategoryName}
              onDismiss={handleDismissAlert}
            />
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard" className="gap-2">
              <ChartBar size={16} weight="duotone" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="submissions" className="gap-2">
              <ListBullets size={16} weight="duotone" />
              Pengajuan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <BudgetOverview
                  totalAllocated={totalAllocated}
                  totalUsed={totalUsed}
                  totalRemaining={totalRemaining}
                  categoryCount={(categories || []).length}
                />
              </div>

              <div className="lg:col-span-1">
                <BudgetStats 
                  categories={categories || []}
                  currentMonthData={currentMonthData}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative flex-1 w-full sm:max-w-md">
                <MagnifyingGlass 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                  size={18}
                />
                <Input
                  placeholder="Cari kategori program..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="healthy">Sehat</SelectItem>
                  <SelectItem value="warning">Peringatan</SelectItem>
                  <SelectItem value="exceeded">Terlampaui</SelectItem>
                </SelectContent>
              </Select>
              {(searchQuery || statusFilter !== 'all') && (
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                  {filteredCategories.length} dari {(categories || []).length} kategori
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map(category => {
                const data = currentMonthData.categories[category.id] || { allocated: category.monthlyBudget, used: 0, submissions: [] }
                return (
                  <BudgetCard
                    key={category.id}
                    categoryName={category.name}
                    allocated={data.allocated}
                    used={data.used}
                    submissionCount={data.submissions.length}
                  />
                )
              })}
            </div>

            {filteredCategories.length === 0 && (searchQuery || statusFilter !== 'all') && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? `Tidak ada kategori yang cocok dengan "${searchQuery}"`
                    : 'Tidak ada kategori dengan status yang dipilih'}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="submissions">
            <SubmissionsTable 
              submissions={allSubmissions}
              getCategoryName={getCategoryName}
            />
          </TabsContent>
        </Tabs>
      </div>

      <SubmissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories || []}
        onSubmit={handleSubmission}
        getRemainingBudget={getRemainingBudget}
      />

      <Toaster />
    </div>
  )
}

export default App