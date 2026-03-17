# TrusterLabs Cybersecurity Dashboard - Features & Components

## Overview

A comprehensive cybersecurity dashboard built with Next.js 16, Framer Motion, and Tailwind CSS 4.2. Features a dark mode theme with teal, orange, purple, and green accents.

## Design System

### Color Scheme (Dark Mode)
- **Primary (Teal)**: `oklch(0.535 0.168 200)` - Main actions and interactive elements
- **Accent (Orange)**: `oklch(0.645 0.195 61)` - Highlights and calls-to-action
- **Secondary (Purple)**: `oklch(0.535 0.15 300)` - Alternative interactive elements
- **Success (Green)**: `oklch(0.605 0.14 142)` - Positive indicators
- **Critical (Red)**: `oklch(0.577 0.245 27.325)` - Alerts and errors
- **Background**: `oklch(0.08 0 0)` - Dark background
- **Card**: `oklch(0.13 0 0)` - Card and elevated surfaces

### Typography
- **Primary Font**: System font stack (Geist)
- **Heading Sizes**: h1-h3 with bold weight
- **Body Text**: Regular weight, 14px+ for accessibility

## Pages

### 1. Dashboard Overview (`/dashboard`)
Main landing page with comprehensive security insights.

**Features:**
- Security Score Card with trend indicator
- Threat Metrics visualization (Critical, High, Medium, Low)
- Real-time incident monitoring with detailed table
- Training progress overview with completion rates
- Threat distribution pie chart
- Weekly threat trend line chart

**Components Used:**
- StatCard (4 variants)
- LineChartComponent
- PieChartComponent
- DataTable
- ThreatMetricsChart

### 2. Security Status (`/security-status`)
Real-time threat and incident management.

**Features:**
- Live threat dashboard with heatmap
- Threat taxonomy and attack vectors
- Incident response pipeline
- System health monitoring
- Top affected assets
- Incident timeline

**Components Used:**
- Card
- Badge
- DataTable
- ProgressBar
- LineChartComponent

### 3. Analytics (`/analytics`)
Detailed metrics and performance analysis.

**Features:**
- Weekly threat trends
- Compliance framework tracking
- Department-wise security metrics
- Attack vector analysis
- Performance statistics
- Custom date range selection

**Components Used:**
- LineChartComponent
- ProgressBar
- StatsOverview
- DataTable
- Section

### 4. Training Programs (`/training`)
Employee cybersecurity training management.

**Features:**
- Course enrollment tracking
- Progress visualization
- Deadline management
- Completion rates
- Training module list
- Performance metrics

**Components Used:**
- ProgressBar
- Card
- DataTable
- StatsOverview
- Modal (for enrollments)

### 5. Internship Applications (`/internships`)
Candidate pipeline and application management.

**Features:**
- Application status tracking
- Candidate ratings and reviews
- Interview scheduling
- Top candidates overview
- Pipeline analytics
- Application timeline

**Components Used:**
- DataTable
- Badge
- StatsOverview
- FilterBar
- Card

### 6. Settings (`/settings`)
User preferences and system configuration.

**Features:**
- User profile management
- Notification preferences
- Security settings
- Display preferences
- Account settings
- Integrations management

**Components Used:**
- Card
- ProgressBar
- Toggle switches
- Input fields
- Modal

### 7. Blog Management (`/blog`)
Content management and publishing.

**Features:**
- Post creation and editing
- Publishing status tracking
- View and engagement metrics
- Publication scheduling
- Author management
- Category organization

**Components Used:**
- DataTable
- Badge
- FilterBar
- Card
- StatsOverview

## Shared Components

### StatCard
Multi-variant card for displaying key metrics.
```tsx
<StatCard
  label="Critical Threats"
  value={223}
  change="+12%"
  isPositive={false}
  variant="critical"
/>
```

### Card
Flexible container with title and subtitle.
```tsx
<Card title="Security Overview" subtitle="Last 7 days">
  {children}
</Card>
```

### Badge
Status indicator with multiple variants.
```tsx
<Badge variant="critical">Critical</Badge>
<Badge variant="success">Resolved</Badge>
```

### DataTable
Flexible table with custom column rendering.
```tsx
<DataTable
  columns={columns}
  data={data}
  rowsPerPage={10}
  onRowClick={(row) => handleSelect(row)}
/>
```

### LineChartComponent
Recharts line chart with theme integration.
```tsx
<LineChartComponent
  data={threatData}
  dataKey="threats"
  height={300}
/>
```

### PieChartComponent
Recharts pie chart for distribution visualization.
```tsx
<PieChartComponent
  data={categoryData}
  height={300}
/>
```

### ProgressBar
Animated progress indicator with variants.
```tsx
<ProgressBar
  value={64}
  label="Completion Rate"
  showPercentage={true}
  variant="success"
/>
```

### Modal
Animated modal dialog with backdrop.
```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Confirm Action"
>
  {content}
</Modal>
```

### Toast
Notification toast with auto-dismiss.
```tsx
<Toast
  message="Action completed successfully"
  type="success"
  duration={3000}
/>
```

### FilterBar
Search and filter UI component.
```tsx
<FilterBar
  onSearch={(term) => handleSearch(term)}
  onFilter={(filters) => handleFilter(filters)}
  filterOptions={[
    { label: 'Critical', value: 'critical' },
    { label: 'High', value: 'high' },
  ]}
/>
```

### Section
Page section with heading and animations.
```tsx
<Section title="Security Metrics" subtitle="Last 30 days">
  {children}
</Section>
```

### StatsOverview
Grid of stat cards with staggered animations.
```tsx
<StatsOverview
  stats={[
    { label: 'Total Threats', value: 1739, change: '+12%' },
    { label: 'Resolved', value: 156, change: '+5%' },
  ]}
  columns={4}
/>
```

## Animations

### Framer Motion Integration
All components feature smooth Framer Motion animations:
- **Page Transitions**: Fade-in effect (300ms)
- **Staggered Animations**: Child elements animate sequentially
- **Hover Effects**: Scale and translate on interactive elements
- **Exit Animations**: Smooth fade-out on unmount

### Animation Utilities
Located in `/lib/animations.ts`:
- `pageTransition` - Page entry/exit
- `containerVariants` - Staggered container
- `itemVariants` - Individual item animation
- `cardHoverVariants` - Card interaction
- `slideInVariants` - Side entrance
- `fadeInVariants` - Fade effect

## Layout

### Responsive Design
- **Mobile**: Full-width, sidebar hidden by default
- **Tablet**: Collapsible sidebar, adjusted spacing
- **Desktop**: Fixed sidebar (288px), full content area

### Navigation
- Sidebar with collapsible menu (mobile)
- Current page highlighting
- Icon + label navigation items
- Smooth transitions between pages

### Header
- Sticky top navigation
- Notification bell with indicator
- User profile dropdown
- Responsive layout

## Data Structure

### Mock Data (`/lib/mockData.ts`)
- Dashboard statistics
- Security metrics
- Incident reports
- Training programs
- Internship applications
- Blog posts

All data is fully structured for easy API integration.

## Getting Started

1. Navigate to `/dashboard` to see the main overview
2. Use sidebar to explore different sections
3. Data is mock-based and updates are client-side
4. Components are fully reusable across pages

## Next Steps

To integrate with real data:
1. Replace mock data imports with API calls
2. Add server-side data fetching where needed
3. Implement real-time updates using WebSockets
4. Add authentication and user management
5. Connect to backend security monitoring systems

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Next.js 16 with Turbopack
- Optimized images and lazy loading
- Efficient re-renders with React 19
- Recharts for performant charts
- CSS-in-JS for dynamic styling

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast colors (WCAG AAA)
- Screen reader friendly content
