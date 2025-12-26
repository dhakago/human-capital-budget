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
import { CategoryDialog } from '@/components/CategoryDialog'
import { CategoryDetailView } from '@/components/CategoryDetailView'
import { YearlyView } from '@/components/YearlyView'
import { Plus, Calendar, ChartBar, ListBullets, ArrowLeft, ArrowRight, MagnifyingGlass, Trash, Pencil, Lock, LockOpen, ChartLine, Gear } from '@phosphor-icons/react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function App() {
  const [categories, setCategories] = useKV<BudgetCategory[]>('budget-categories', [])
  const [monthlyData, setMonthlyData] = useKV<{ [month: string]: MonthlyBudgetData }>('monthly-budget-data', {})
  const [dismissedAlerts, setDismissedAlerts] = useKV<string[]>('dismissed-alerts', [])
  const [isLocked, setIsLocked] = useKV<boolean>('budget-locked', false)
  
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | undefined>(undefined)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [preSelectedSubItem, setPreSelectedSubItem] = useState<string | undefined>(undefined)
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
        const subItemsData: { [subItemId: string]: { allocated: number; used: number; submissions: Submission[] } } = {}
        cat.subItems.forEach(subItem => {
          subItemsData[subItem.id] = {
            allocated: subItem.monthlyBudget,
            used: 0,
            submissions: []
          }
        })
        newMonthData.categories[cat.id] = {
          allocated: cat.monthlyBudget,
          used: 0,
          submissions: [],
          subItems: subItemsData
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

  const handleSubmission = async (categoryId: string, subItemId: string | undefined, amount: number, description: string, executionMonth: string): Promise<boolean> => {
    const cats = categories || []
    
    const newSubmission: Submission = {
      id: `sub-${Date.now()}`,
      categoryId,
      subItemId,
      amount,
      description,
      date: new Date().toISOString(),
      executionMonth,
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
          const subItemsData: { [subItemId: string]: { allocated: number; used: number; submissions: Submission[] } } = {}
          cat.subItems.forEach(subItem => {
            subItemsData[subItem.id] = {
              allocated: subItem.monthlyBudget,
              used: 0,
              submissions: []
            }
          })
          updated[selectedMonth].categories[cat.id] = {
            allocated: cat.monthlyBudget,
            used: 0,
            submissions: [],
            subItems: subItemsData
          }
        })
      }

      const categoryData = updated[selectedMonth].categories[categoryId]
      if (!categoryData) return updated

      categoryData.submissions = [...categoryData.submissions, newSubmission]
      categoryData.used = categoryData.submissions.reduce((sum, sub) => sum + sub.amount, 0)

      if (subItemId && categoryData.subItems[subItemId]) {
        categoryData.subItems[subItemId].submissions = [...categoryData.subItems[subItemId].submissions, newSubmission]
        categoryData.subItems[subItemId].used = categoryData.subItems[subItemId].submissions.reduce((sum, sub) => sum + sub.amount, 0)
      }

      return updated
    })

    return true
  }

  const getRemainingBudget = (categoryId: string, subItemId?: string): number => {
    const data = currentMonthData.categories[categoryId]
    if (!data) return 0
    
    if (subItemId && data.subItems[subItemId]) {
      return data.subItems[subItemId].allocated - data.subItems[subItemId].used
    }
    
    return data.allocated - data.used
  }

  const handleSaveCategory = (categoryData: Omit<BudgetCategory, 'id'> & { id?: string }) => {
    if (isLocked) {
      toast.error('Anggaran terkunci. Tidak dapat mengedit kategori.')
      return
    }
    
    if (categoryData.id) {
      setCategories((current) => 
        (current || []).map(cat => 
          cat.id === categoryData.id 
            ? { ...categoryData, id: categoryData.id } as BudgetCategory
            : cat
        )
      )
    } else {
      const newCategory: BudgetCategory = {
        ...categoryData,
        id: `cat-${Date.now()}`,
        subItems: categoryData.subItems
      }
      setCategories((current) => [...(current || []), newCategory])
    }
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (isLocked) {
      toast.error('Anggaran terkunci. Tidak dapat menghapus kategori.')
      return
    }
    setCategoryToDelete(categoryId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      setCategories((current) => (current || []).filter(cat => cat.id !== categoryToDelete))
      toast.success('Kategori berhasil dihapus')
      setCategoryToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleEditCategory = (category: BudgetCategory) => {
    if (isLocked) {
      toast.error('Anggaran terkunci. Tidak dapat mengedit kategori.')
      return
    }
    setEditingCategory(category)
    setCategoryDialogOpen(true)
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
  }

  const handleAddSubmissionFromDetail = (subItemId: string) => {
    setPreSelectedSubItem(subItemId)
    setDialogOpen(true)
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
        const data = currentMonthData.categories[cat.id]
        if (!data) return false
        const percentage = calculateUsage(data.allocated, data.used)
        
        if (statusFilter === 'exceeded') return percentage >= 100
        if (statusFilter === 'warning') return percentage >= 80 && percentage < 100
        if (statusFilter === 'healthy') return percentage < 80
        return true
      })
    }
    
    return filtered
  }, [categories, searchQuery, statusFilter, currentMonthData])

  const selectedCategory = selectedCategoryId 
    ? (categories || []).find(c => c.id === selectedCategoryId)
    : null

  const selectedCategoryData = selectedCategoryId && currentMonthData.categories[selectedCategoryId]
    ? currentMonthData.categories[selectedCategoryId]
    : null

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">Budget HCGA 2026</h1>
              <p className="text-muted-foreground mt-1">Human Capital & General Affairs</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant={isLocked ? "destructive" : "outline"}
                size="sm"
                onClick={() => {
                  setIsLocked((current) => !current)
                  toast.success(isLocked ? 'Anggaran dibuka untuk editing' : 'Anggaran dikunci')
                }}
                className="gap-2"
              >
                {isLocked ? (
                  <>
                    <Lock size={16} weight="bold" />
                    Terkunci
                  </>
                ) : (
                  <>
                    <LockOpen size={16} weight="bold" />
                    Terbuka
                  </>
                )}
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'monthly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('monthly')}
                  className="gap-2"
                >
                  <Calendar size={16} weight="duotone" />
                  Bulanan
                </Button>
                <Button
                  variant={viewMode === 'yearly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('yearly')}
                  className="gap-2"
                >
                  <ChartLine size={16} weight="duotone" />
                  Tahunan
                </Button>
              </div>

              {viewMode === 'monthly' ? (
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
                    <SelectTrigger className="w-[180px]">
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
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedYear(y => y - 1)}
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2024, 2025, 2026, 2027, 2028].map(year => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSelectedYear(y => y + 1)}
                  >
                    <ArrowRight size={16} />
                  </Button>
                </div>
              )}

              {!selectedCategoryId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="gap-2">
                      <Gear size={18} weight="bold" />
                      Menu
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {viewMode === 'monthly' && (
                      <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                        <Plus size={16} weight="bold" className="mr-2" />
                        Buat Pengajuan
                      </DropdownMenuItem>
                    )}
                    {!isLocked && (
                      <DropdownMenuItem onClick={() => {
                        setEditingCategory(undefined)
                        setCategoryDialogOpen(true)
                      }}>
                        <Plus size={16} weight="bold" className="mr-2" />
                        Tambah Kategori
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {alerts.length > 0 && !selectedCategoryId && (
          <div className="mb-6">
            <BudgetAlerts 
              alerts={alerts} 
              getCategoryName={getCategoryName}
              onDismiss={handleDismissAlert}
            />
          </div>
        )}

        {selectedCategory && selectedCategoryData ? (
          <CategoryDetailView
            category={selectedCategory}
            categoryData={selectedCategoryData}
            onBack={() => setSelectedCategoryId(null)}
            onEdit={() => handleEditCategory(selectedCategory)}
            onAddSubmission={handleAddSubmissionFromDetail}
            isLocked={isLocked}
          />
        ) : viewMode === 'yearly' ? (
          <YearlyView
            year={selectedYear}
            categories={categories || []}
            monthlyData={monthlyData || {}}
          />
        ) : (
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
                  const data = currentMonthData.categories[category.id]
                  if (!data) return null
                  
                  return (
                    <div key={category.id} className="relative group">
                      {!isLocked && (
                        <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditCategory(category)
                            }}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteCategory(category.id)
                            }}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      )}
                      <div onClick={() => handleCategoryClick(category.id)} className="cursor-pointer">
                        <BudgetCard
                          categoryName={category.name}
                          allocated={data.allocated}
                          used={data.used}
                          submissionCount={data.submissions.length}
                        />
                      </div>
                    </div>
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
        )}
      </div>

      <SubmissionDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setPreSelectedSubItem(undefined)
          }
        }}
        categories={categories || []}
        onSubmit={handleSubmission}
        getRemainingBudget={getRemainingBudget}
        preSelectedCategory={selectedCategoryId || undefined}
        preSelectedSubItem={preSelectedSubItem}
      />

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={(open) => {
          setCategoryDialogOpen(open)
          if (!open) {
            setEditingCategory(undefined)
          }
        }}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}

export default App