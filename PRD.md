# Planning Guide

A comprehensive budgeting dashboard system for Human Capital programs (HCGA 2026) that enables hierarchical budget tracking with main categories and detailed sub-items, submission management, and automated notifications when budgets approach or exceed limits.

**Experience Qualities**: 
1. **Transparent** - Users should always know their current budget status, remaining funds, and submission history at a glance
2. **Proactive** - The system anticipates budget issues by warning users before limits are reached
3. **Efficient** - Submitting new budget requests should be quick and straightforward with minimal friction

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
- This application manages hierarchical budget categories for HCGA 2026 with main categories (Biaya Kantor, Biaya Transport, Biaya Pemeliharaan, Biaya Umum, Honorarium) each containing multiple sub-items, requiring CRUD operations on categories, real-time budget calculations at both category and sub-item levels, time-based budget periods, notification systems, and comprehensive data visualization across different views.

## Essential Features

**Hierarchical Budget Category Management**
- Functionality: Display main budget categories (BIAYA KANTOR, BIAYA TRANSPORT, BIAYA PEMELIHARAAN, BIAYA UMUM, HONORARIUM) as cards on dashboard; clicking a card reveals detailed sub-items within that category
- Purpose: Provides organized view of budget hierarchy, allowing users to drill down from high-level categories to specific line items
- Trigger: Dashboard automatically shows main categories; clicking a category card navigates to detail view
- Progression: Dashboard loads → Main category cards display → User clicks card → Detail view shows sub-items → Can add submissions to specific sub-items
- Success criteria: Main categories aggregate sub-item totals accurately, drill-down navigation is intuitive, users can easily navigate back to main view

**Category CRUD Operations**
- Functionality: Add new main categories with sub-items, edit existing categories and their sub-items, delete categories
- Purpose: Allows budget administrators to maintain and update the budget structure as organizational needs change
- Trigger: "Tambah Kategori" button in header, edit/delete buttons on category cards
- Progression: Click add → Dialog opens → Enter category name → Add sub-items with names and budgets → Save → Category appears on dashboard
- Success criteria: Categories can be created with multiple sub-items, edited to modify structure, and deleted with confirmation

**Sub-Item Budget Tracking**
- Functionality: Each sub-item within a category tracks its own allocated budget, used amount, submissions, and remaining balance
- Purpose: Enables granular budget control at the line-item level while maintaining category-level aggregation
- Trigger: View category detail page
- Progression: Click category card → Detail view loads → Sub-items display with individual budgets → Each shows usage percentage and status
- Success criteria: Sub-item budgets are independently tracked, category totals correctly aggregate from sub-items

**Budget Search & Filter**
- Functionality: Real-time search across main categories with status filtering (all, healthy, warning, exceeded)
- Purpose: Improves usability when dealing with large number of budget categories
- Trigger: User types in search field or selects filter
- Progression: Type query → Filter results in real-time → Show match count → Clear search to reset
- Success criteria: Search returns relevant categories instantly and shows clear feedback on number of matches

**Budget Overview Dashboard**
- Functionality: High-level summary cards showing total allocated budget, total used, remaining budget, and category count
- Purpose: Provides executive overview of entire HCGA 2026 budget status at a glance
- Trigger: Automatically displays at top of dashboard
- Progression: Page loads → Calculate totals across all categories and sub-items → Display summary cards → Update on any submission
- Success criteria: Accurate real-time totals across all categories with clear visual hierarchy

**Submission Creation**
- Functionality: Create new budget submissions by selecting a category, then a sub-item, entering amount and description
- Purpose: Allows users to request budget allocation from specific sub-items and automatically deducts from available budgets
- Trigger: User clicks "Buat Pengajuan" button or "Buat Pengajuan" on a specific sub-item
- Progression: Click button → Dialog opens → Select category → Select sub-item → Fill amount and description → Submit → Budget automatically deducted from sub-item and category → Confirmation shown
- Success criteria: Submission is created, sub-item and category budgets are updated in real-time, and user sees updated balances immediately

**Budget Status Notifications**
- Functionality: Display warning alerts when budgets reach 80% threshold and critical alerts when exceeded
- Purpose: Prevents budget overruns by proactively notifying users of approaching limits
- Trigger: Automatic when budget usage crosses thresholds (80% warning, 100% exceeded)
- Progression: Budget update → Check thresholds → Display alert banner → User acknowledges or takes action
- Success criteria: Alerts appear prominently when thresholds are crossed and persist until acknowledged

**Monthly Budget Period Management**
- Functionality: Track budgets by month with the ability to view current and historical periods
- Purpose: Ensures budgets reset monthly and enables historical tracking
- Trigger: Month selector in header, automatic current month display on load
- Progression: Select month → Data filters to selected period → View budget status for that month → Compare across months
- Success criteria: Users can navigate between months and see accurate historical budget data

**Submission History**
- Functionality: Comprehensive list of all submissions with filtering, sorting, and status tracking
- Purpose: Provides audit trail and helps users understand spending patterns
- Trigger: Navigate to submissions view
- Progression: Click submissions tab → Table loads → Apply filters/sort → View details → Export if needed
- Success criteria: All submissions are visible with accurate timestamps, amounts, and categories

## Edge Case Handling

- **Insufficient Budget**: When submission amount exceeds remaining sub-item budget, show clear error message with current available amount and prevent submission
- **Concurrent Submissions**: Handle multiple users submitting simultaneously by validating budget availability at submission time
- **Month Transitions**: Automatically switch to new month when date changes and reset budgets appropriately
- **Empty States**: Display helpful empty states when no submissions exist for a period with call-to-action to create first submission
- **Invalid Amounts**: Prevent negative or zero amounts, validate numeric input, and enforce reasonable maximum values
- **Category Deletion**: Confirm before deleting categories; prevent deletion if there are existing submissions for that category in any month
- **Empty Sub-Items**: Require at least one sub-item when creating or editing a category
- **Budget Aggregation**: Ensure category total budget always equals sum of all sub-item budgets

## Design Direction

The design should evoke confidence, clarity, and control - like a financial command center. It should feel professional yet approachable, with data-driven insights presented in an easily digestible format. The interface should communicate financial stability and precision while being welcoming enough for non-financial team members to use comfortably.

## Color Selection

A professional financial palette with warm accents to maintain approachability.

- **Primary Color**: Deep navy blue (oklch(0.35 0.08 250)) - Communicates trust, stability, and professionalism typical of financial applications
- **Secondary Colors**: 
  - Slate gray (oklch(0.55 0.015 250)) for secondary actions and backgrounds
  - Soft blue-gray (oklch(0.92 0.01 250)) for subtle containers
- **Accent Color**: Vibrant coral (oklch(0.68 0.18 25)) - Draws attention to CTAs and important financial alerts, provides warmth against the cool palette
- **Foreground/Background Pairings**: 
  - Background (Soft cream oklch(0.98 0.01 90)): Navy text (oklch(0.25 0.08 250)) - Ratio 11.2:1 ✓
  - Primary (Deep navy oklch(0.35 0.08 250)): White text (oklch(1 0 0)) - Ratio 8.9:1 ✓
  - Accent (Coral oklch(0.68 0.18 25)): White text (oklch(1 0 0)) - Ratio 4.6:1 ✓
  - Success (Green oklch(0.65 0.17 145)): White text (oklch(1 0 0)) - Ratio 5.1:1 ✓
  - Warning (Amber oklch(0.75 0.15 75)): Navy text (oklch(0.25 0.08 250)) - Ratio 7.8:1 ✓
  - Destructive (Red oklch(0.55 0.22 25)): White text (oklch(1 0 0)) - Ratio 5.2:1 ✓

## Font Selection

Typography should balance authority with readability - crisp enough for financial data, warm enough for daily use.

- **Primary Font**: Space Grotesk - A geometric sans-serif with a technical feel that brings personality while maintaining excellent legibility for numbers and data tables
- **Secondary Font**: Inter - For body text and descriptions, ensuring maximum readability in smaller sizes

- **Typographic Hierarchy**: 
  - H1 (Dashboard Title): Space Grotesk Bold / 32px / -0.02em letter spacing
  - H2 (Section Headers): Space Grotesk SemiBold / 24px / -0.01em letter spacing  
  - H3 (Card Titles): Space Grotesk Medium / 18px / normal letter spacing
  - Body (Descriptions): Inter Regular / 15px / normal letter spacing / 1.6 line height
  - Labels (Form fields): Inter Medium / 14px / normal letter spacing
  - Data (Numbers/Amounts): Space Grotesk Medium / 16px / tabular-nums

## Animations

Animations should feel precise and purposeful, like a well-tuned financial instrument - everything moves with intention.

- **Micro-interactions**: Button presses have subtle scale transforms (0.98) with spring physics
- **Alert Animations**: Warning/error alerts slide in from top with gentle bounce, emphasizing their importance
- **Budget Progress**: Progress bars animate smoothly when values update, with color transitions when crossing thresholds
- **Page Transitions**: Subtle fade and slide-up (10px) when switching between months or views
- **Loading States**: Skeleton loaders with shimmer effect for data-heavy components
- **Number Updates**: When budget values change, numbers count up/down with easing for satisfying feedback

## Component Selection

- **Components**: 
  - Card (primary container for budget categories and sub-items, heavily used throughout)
  - Button (primary/secondary/destructive variants for actions, including edit/delete on categories)
  - Dialog (for submission creation and category management forms)
  - Alert (for budget threshold warnings)
  - AlertDialog (for category deletion confirmation)
  - Progress (visual budget usage indicators at category and sub-item level)
  - Select (month/category/sub-item choosers)
  - Input (amount, description, category name, sub-item name fields)
  - Label (form field labels)
  - Table (submission history)
  - Badge (status indicators for submissions and budget health)
  - Tabs (switching between dashboard/submissions views)
  - Separator (visual section breaks)

- **Customizations**: 
  - Custom budget card component with integrated progress bar, status indicators, and hover actions for edit/delete
  - Custom category detail view component showing hierarchical sub-item structure
  - Custom category dialog for adding/editing categories with dynamic sub-item management
  - Custom currency input with automatic formatting
  - Custom alert variant for 80% threshold warnings (distinct from 100% exceeded)
  - Custom metric display component for large financial numbers

- **States**: 
  - Buttons: Default has shadow, hover lifts with stronger shadow, active scales down, disabled is muted
  - Inputs: Default has subtle border, focus has accent ring and stronger border, error has destructive border
  - Cards: Default has subtle shadow, hover on interactive cards lifts slightly and reveals edit/delete actions
  - Progress bars: Color changes based on percentage (green < 70%, amber 70-90%, red > 90%)

- **Icon Selection**: 
  - Plus (add submission, add category, add sub-item)
  - Pencil (edit category)
  - Trash (delete category)
  - ArrowLeft (back to main categories, navigate months)
  - ArrowRight (navigate months)
  - FolderOpen (category detail view)
  - Wallet (budget categories)
  - TrendUp (budget increase)
  - TrendDown (budget decrease)  
  - Warning (threshold alerts)
  - Calendar (month selector)
  - ListBullets (submission history)
  - ChartBar (dashboard view)
  - MagnifyingGlass (search)

- **Spacing**: 
  - Card padding: p-6
  - Section gaps: gap-6
  - Form fields: gap-4
  - Inline elements: gap-2
  - Page margins: p-6 to p-8

- **Mobile**: 
  - Budget cards stack vertically on mobile
  - Category detail view sub-items stack vertically
  - Table switches to card-based layout for submissions
  - Month navigation becomes dropdown instead of arrows
  - Dialog forms maintain full-width inputs
  - Alert banners stack and take full width
  - Reduce padding to p-4 on containers
  - Edit/delete buttons on categories remain visible on mobile (no hover state)
  - Category management dialog scrolls vertically for long sub-item lists
