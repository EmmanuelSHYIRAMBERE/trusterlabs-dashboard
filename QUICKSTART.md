# TrusterLabs Dashboard - Quick Start Guide

## Project Setup

The dashboard is already fully configured and ready to run. Here's what's been set up:

### ✅ Installed Dependencies
- **Next.js 16** with Turbopack (default bundler)
- **React 19** with latest features
- **Framer Motion** for smooth animations
- **Tailwind CSS 4.2** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

### ✅ Design System
- Dark mode cybersecurity theme
- Teal, orange, purple, green color palette
- Semantic design tokens in globals.css
- Custom typography with Geist font

## Running the Dashboard

### Start Development Server
```bash
npm run dev
# or
pnpm dev
```

The dashboard will be available at `http://localhost:3000`

### Access Pages

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/dashboard` | Main security overview |
| Security Status | `/security-status` | Real-time threat monitoring |
| Analytics | `/analytics` | Detailed metrics |
| Training | `/training` | Training management |
| Internships | `/internships` | Candidate pipeline |
| Blog | `/blog` | Content management |
| Settings | `/settings` | User preferences |

## Project Structure

```
app/
├── layout.tsx          # Root layout with dark mode
├── page.tsx            # Home redirect to dashboard
├── dashboard/
│   └── page.tsx        # Dashboard overview
├── security-status/
│   └── page.tsx
├── analytics/
│   └── page.tsx
├── training/
│   └── page.tsx
├── internships/
│   └── page.tsx
├── blog/
│   └── page.tsx
└── settings/
    └── page.tsx

components/
├── layout/
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── Header.tsx       # Top header
│   └── DashboardLayout.tsx # Page wrapper
└── shared/
    ├── StatCard.tsx     # Metric cards
    ├── Card.tsx         # Content wrapper
    ├── Badge.tsx        # Status indicators
    ├── DataTable.tsx    # Data display
    ├── LineChartComponent.tsx
    ├── PieChartComponent.tsx
    ├── ThreatMetricsChart.tsx
    ├── ProgressBar.tsx
    ├── Modal.tsx
    ├── Toast.tsx
    ├── FilterBar.tsx
    ├── Section.tsx
    ├── StatsOverview.tsx
    └── index.ts         # Component exports

lib/
├── mockData.ts         # Sample data
├── animations.ts       # Framer Motion variants
├── utils.ts            # Utility functions
└── ...

styles/
└── globals.css         # Design tokens & styles
```

## Key Features

### 🎨 Design System
- **Dark Mode Only**: Cybersecurity aesthetic
- **Custom Colors**: Teal (primary), Orange (accent), Purple (secondary), Green (success)
- **Responsive**: Mobile-first, works on all devices
- **Animations**: Smooth Framer Motion transitions throughout

### 📊 Components
- **StatCard**: Display metrics with trends
- **DataTable**: Show tabular data with actions
- **Charts**: Line, pie, and bar charts with Recharts
- **ProgressBar**: Animated progress indicators
- **Modal**: Animated dialogs for confirmations
- **Toast**: Notifications with auto-dismiss
- **FilterBar**: Search and filter functionality

### 🔄 Animations
- Page transitions on navigation
- Staggered child animations
- Hover effects on cards
- Loading states
- Exit animations

### 📱 Responsive Design
- Collapsible sidebar on mobile
- Flexible grid layouts
- Touch-friendly controls
- Optimized typography sizing

## Using Components

### Import from Shared Components
```tsx
import { StatCard, Card, Badge, DataTable } from '@/components/shared';
```

### Create a Stat Card
```tsx
<StatCard
  label="Critical Threats"
  value={223}
  change="+12%"
  isPositive={false}
  variant="critical"
/>
```

### Create a Modal
```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  Are you sure?
</Modal>
```

### Create a Data Table
```tsx
<DataTable
  columns={[
    { key: 'name', label: 'Name', width: '30%' },
    { key: 'status', label: 'Status', width: '20%' },
  ]}
  data={incidents}
  rowsPerPage={10}
/>
```

### Add Animations
```tsx
import { containerVariants, itemVariants } from '@/lib/animations';
import { motion } from 'framer-motion';

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  <motion.div variants={itemVariants}>Item 1</motion.div>
  <motion.div variants={itemVariants}>Item 2</motion.div>
</motion.div>
```

## Customization

### Change Colors
Edit color definitions in `/app/globals.css`:
```css
--teal-primary: oklch(0.535 0.168 200);
--orange-accent: oklch(0.645 0.195 61);
```

### Update Navigation
Edit `/components/layout/Sidebar.tsx`:
```tsx
const navItems = [
  { icon: IconComponent, label: 'Page Name', href: '/path' },
  // Add more items
];
```

### Add New Page
1. Create `app/new-page/page.tsx`
2. Wrap content with `<DashboardLayout>`
3. Add navigation item in Sidebar
4. Use shared components

### Modify Mock Data
Edit `/lib/mockData.ts` to update sample data for development.

## Integration with Real Data

### Replace Mock Data
```tsx
// Current: mock data
import { dashboardStats } from '@/lib/mockData';

// Replace with: API call
const { data: dashboardStats } = useSWR('/api/dashboard/stats', fetcher);
```

### Add API Routes
Create `app/api/dashboard/stats/route.ts`:
```tsx
export async function GET() {
  const stats = await fetchStatsFromDatabase();
  return Response.json(stats);
}
```

### Connect to Backend
Update environment variables and replace mock imports with API calls.

## Building for Production

```bash
npm run build
npm start
```

The dashboard is optimized with:
- Static generation where possible
- Image optimization
- Code splitting
- CSS optimization
- Turbopack bundling

## Performance Tips

1. **Use Image Optimization**: Replace placeholder images with Next.js `<Image>`
2. **Lazy Load Charts**: Import charts dynamically if not immediately visible
3. **Memoize Components**: Use `React.memo()` for expensive renders
4. **Virtualize Tables**: Use virtual scrolling for large datasets

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile: iOS 12+, Android 8+

## Troubleshooting

### 404 on Routes
- Check page files exist in correct directories
- Verify DashboardLayout wraps page content
- Clear `.next` folder: `rm -rf .next`

### Animations Not Working
- Ensure Framer Motion is installed: `npm list framer-motion`
- Check `'use client'` directive at top of components
- Verify motion imports: `import { motion } from 'framer-motion'`

### Styling Issues
- Dark mode should be set in layout.tsx: `<html className="dark">`
- Check design tokens in globals.css are defined
- Clear Tailwind cache if styles don't update

### Charts Not Displaying
- Verify Recharts is installed: `npm list recharts`
- Check container has defined height
- Ensure chart data structure is correct

## Getting Help

1. Check `/DASHBOARD_FEATURES.md` for detailed component docs
2. Review component examples in existing pages
3. Check Next.js docs: https://nextjs.org
4. Check Framer Motion docs: https://www.framer.com/motion/

## Next Steps

1. **Customize Colors**: Update the theme in `globals.css`
2. **Connect Real Data**: Replace mock data with API calls
3. **Add Authentication**: Implement user login and permissions
4. **Deploy**: Push to GitHub and deploy to Vercel
5. **Monitor**: Add error tracking and analytics

Happy coding! 🚀
