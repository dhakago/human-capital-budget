# Planning Guide

A comprehensive budgeting dashboard system for Human Capital programs that enables budget tracking, submission management, and automated notifications when budgets approach or exceed limits.

**Experience Qualities**: 
1. **Transparent** - Users should always know their current budget status, remaining funds, and submission history at a glance
2. **Proactive** - The system anticipates budget issues by warning users before limits are reached
3. **Efficient** - Submitting new budget requests should be quick and straightforward with minimal friction

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
- This application requires multiple interconnected features including budget category management, submission tracking, real-time budget calculations, time-based budget periods, notification systems, and comprehensive data visualization across different views.

## Essential Features

**Budget Category Management**
- Functionality: Display all HC program categories with their monthly budget allocations, current usage, and remaining amounts
- Purpose: Provides complete visibility into budget distribution and helps prevent overspending
- Trigger: Automatically loads on dashboard view
- Progression: Dashboard loads → Budget cards display → Real-time usage shown → Color-coded status indicators
- Success criteria: All categories show accurate current vs. allocated amounts with visual progress indicators

**Submission Creation**
- Functionality: Create new budget submissions with category selection, amount, description, and automatic date assignment
- Purpose: Allows users to request budget allocation and automatically deducts from available category budgets
- Trigger: User clicks "New Submission" button
- Progression: Click button → Dialog opens → Fill form (category, amount, description) → Submit → Budget automatically deducted → Confirmation shown
- Success criteria: Submission is created, budget is updated in real-time, and user sees updated balances immediately

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

- **Insufficient Budget**: When submission amount exceeds remaining budget, show clear error message with current available amount and prevent submission
- **Concurrent Submissions**: Handle multiple users submitting simultaneously by validating budget availability at submission time
- **Month Transitions**: Automatically switch to new month when date changes and reset budgets appropriately
- **Empty States**: Display helpful empty states when no submissions exist for a period with call-to-action to create first submission
- **Invalid Amounts**: Prevent negative or zero amounts, validate numeric input, and enforce reasonable maximum values

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
  - Card (primary container for budget categories, heavily used throughout)
  - Button (primary/secondary/destructive variants for actions)
  - Dialog (for submission creation form)
  - Alert (for budget threshold warnings)
  - Progress (visual budget usage indicators)
  - Select (month/category choosers)
  - Input (amount and description fields)
  - Label (form field labels)
  - Table (submission history)
  - Badge (status indicators for submissions)
  - Tabs (switching between dashboard/submissions views)
  - Separator (visual section breaks)

- **Customizations**: 
  - Custom budget card component with integrated progress bar and status indicators
  - Custom currency input with automatic formatting
  - Custom alert variant for 80% threshold warnings (distinct from 100% exceeded)
  - Custom metric display component for large financial numbers

- **States**: 
  - Buttons: Default has shadow, hover lifts with stronger shadow, active scales down, disabled is muted
  - Inputs: Default has subtle border, focus has accent ring and stronger border, error has destructive border
  - Cards: Default has subtle shadow, hover on interactive cards lifts slightly
  - Progress bars: Color changes based on percentage (green < 70%, amber 70-90%, red > 90%)

- **Icon Selection**: 
  - Plus (add submission)
  - Wallet (budget categories)
  - TrendUp (budget increase)
  - TrendDown (budget decrease)  
  - Warning (threshold alerts)
  - Calendar (month selector)
  - ArrowLeft/ArrowRight (month navigation)
  - ListBullets (submission history)
  - ChartBar (dashboard view)

- **Spacing**: 
  - Card padding: p-6
  - Section gaps: gap-6
  - Form fields: gap-4
  - Inline elements: gap-2
  - Page margins: p-6 to p-8

- **Mobile**: 
  - Budget cards stack vertically on mobile
  - Table switches to card-based layout for submissions
  - Month navigation becomes dropdown instead of arrows
  - Dialog forms maintain full-width inputs
  - Alert banners stack and take full width
  - Reduce padding to p-4 on containers
