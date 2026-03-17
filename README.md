# TrusterLabs Cybersecurity Dashboard

A modern, fully-featured cybersecurity monitoring and management dashboard built with Next.js 16, React 19, and Framer Motion. Features real-time threat monitoring, incident management, training programs, internship applications, and comprehensive analytics.

![Tech Stack](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![React](https://img.shields.io/badge/React-19-blue?logo=react) ![TailwindCSS](https://img.shields.io/badge/Tailwind-4.2-06B6D4?logo=tailwindcss) ![Framer Motion](https://img.shields.io/badge/Framer-Motion-purple?logo=framer)

## 🎯 Features

### Dashboard Pages
- **Dashboard Overview** - Security metrics, threat trends, incident monitoring
- **Security Status** - Real-time threat tracking and incident management
- **Analytics** - Detailed metrics and compliance tracking
- **Training Programs** - Employee cybersecurity training management
- **Internship Applications** - Candidate pipeline and tracking
- **Blog Management** - Content creation and publishing
- **Settings** - User preferences and system configuration

### Design & UX
- 🌙 **Dark Mode Cybersecurity Theme** - Teal, orange, purple, green accents
- ✨ **Smooth Animations** - Framer Motion page transitions and interactions
- 📱 **Fully Responsive** - Mobile-first design for all devices
- ♿ **Accessible** - WCAG AAA compliant with semantic HTML
- 🎨 **Custom Design System** - Cohesive color tokens and typography

### Components
- **StatCard** - Metric display with trends
- **DataTable** - Flexible data grid with custom rendering
- **Charts** - Line, pie, and bar charts with Recharts
- **ProgressBar** - Animated progress indicators
- **Modal** - Animated dialogs with backdrop
- **Toast** - Auto-dismissing notifications
- **FilterBar** - Search and filter functionality
- **Badge** - Status indicators
- **Card** - Content containers
- **Section** - Page section with heading

### Technology Stack
- **Next.js 16** - React framework with Turbopack
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.2** - Utility-first styling
- **Framer Motion 12** - Animation library
- **Recharts** - React chart library
- **Lucide React** - Icon library

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm (or npm/yarn)

### Installation
```bash
# Clone or download the project
cd truster-labs-dashboard

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:3000` and you'll be redirected to `/dashboard`

## 📂 Project Structure

```
TrusterLabs/
├── app/                           # Next.js app directory
│   ├── page.tsx                   # Home (redirects to dashboard)
│   ├── layout.tsx                 # Root layout with dark mode
│   ├── globals.css                # Design tokens & styles
│   ├── dashboard/                 # Dashboard overview
│   ├── security-status/           # Threat monitoring
│   ├── analytics/                 # Metrics & analytics
│   ├── training/                  # Training programs
│   ├── internships/               # Internship pipeline
│   ├── blog/                      # Blog management
│   └── settings/                  # User settings
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx            # Navigation sidebar
│   │   ├── Header.tsx             # Top header bar
│   │   └── DashboardLayout.tsx    # Page wrapper
│   ├── shared/                    # Reusable components
│   │   ├── StatCard.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── DataTable.tsx
│   │   ├── LineChartComponent.tsx
│   │   ├── PieChartComponent.tsx
│   │   ├── ThreatMetricsChart.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── FilterBar.tsx
│   │   ├── Section.tsx
│   │   ├── StatsOverview.tsx
│   │   └── index.ts               # Component exports
│   └── ui/                        # shadcn/ui components
│
├── lib/
│   ├── mockData.ts                # Sample data
│   ├── animations.ts              # Framer Motion variants
│   └── utils.ts                   # Helper functions
│
├── docs/
│   ├── QUICKSTART.md              # Getting started guide
│   ├── DASHBOARD_FEATURES.md      # Feature documentation
│   └── README.md                  # This file
│
└── Configuration
    ├── package.json               # Dependencies
    ├── tsconfig.json              # TypeScript config
    ├── tailwind.config.ts         # Tailwind config (in globals.css)
    └── next.config.mjs            # Next.js config
```

## 🎨 Design System

### Color Palette
- **Teal Primary**: Main interactive elements
- **Orange Accent**: Highlights and CTAs
- **Purple Secondary**: Alternative interactions
- **Green Success**: Positive indicators
- **Red Critical**: Alerts and errors
- **Dark Background**: `oklch(0.08 0 0)`
- **Card Surface**: `oklch(0.13 0 0)`

### Typography
- **Display**: 2xl/3xl bold
- **Heading**: xl/2xl bold
- **Body**: sm/base regular
- **Small**: xs regular

### Spacing
Uses Tailwind's standard spacing scale (4px increments):
- `p-4` = 16px padding
- `gap-6` = 24px gap
- `mb-8` = 32px margin bottom

## 📖 Usage

### Basic Page Setup
```tsx
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard, Card } from '@/components/shared';

export default function MyPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <StatCard 
          label="Key Metric" 
          value={42}
          change="+5%"
        />
        <Card title="Section">
          Content here
        </Card>
      </div>
    </DashboardLayout>
  );
}
```

### Using Animations
```tsx
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';

<motion.div 
  variants={containerVariants} 
  initial="hidden" 
  animate="visible"
>
  <motion.div variants={itemVariants}>Item 1</motion.div>
  <motion.div variants={itemVariants}>Item 2</motion.div>
</motion.div>
```

### Creating a Data Table
```tsx
<DataTable
  columns={[
    { key: 'name', label: 'Name', width: '30%' },
    { key: 'status', label: 'Status', width: '20%' },
  ]}
  data={dataArray}
  rowsPerPage={10}
/>
```

## 🔌 Integration with Real Data

### Replace Mock Data
1. Create API routes in `app/api/`
2. Update component imports from `mockData` to API calls
3. Use SWR or React Query for data fetching

Example:
```tsx
import useSWR from 'swr';

export default function Dashboard() {
  const { data: stats } = useSWR('/api/dashboard/stats');
  
  return (
    <DashboardLayout>
      {/* Use stats data */}
    </DashboardLayout>
  );
}
```

### Add Authentication
1. Implement auth middleware
2. Protect routes with authentication check
3. Store user session in HTTP-only cookie
4. Add logout functionality in Header

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (full-width)
- **Tablet**: 640px - 1024px (sidebar collapsible)
- **Desktop**: > 1024px (fixed sidebar)

## 🔄 Animation Variants

Located in `/lib/animations.ts`:
- `pageTransition` - Page entry/exit
- `containerVariants` - Staggered children
- `itemVariants` - Individual item animation
- `cardHoverVariants` - Card interactions
- `slideInVariants` - Side entrance
- `fadeInVariants` - Fade effect

## 🎯 Component API

### StatCard
```tsx
<StatCard
  label="Label"
  value={number | string}
  change="Change percentage"
  isPositive={boolean}
  icon={ReactNode}
  variant="default" | "critical" | "warning" | "success"
/>
```

### Modal
```tsx
<Modal
  isOpen={boolean}
  onClose={() => {}}
  title="Title"
  size="sm" | "md" | "lg"
>
  Content
</Modal>
```

### ProgressBar
```tsx
<ProgressBar
  value={number}
  max={number}
  label="Label"
  showPercentage={boolean}
  variant="default" | "success" | "warning" | "critical"
  size="sm" | "md" | "lg"
/>
```

## 📊 Charts

### LineChartComponent
```tsx
<LineChartComponent
  data={array}
  dataKey="keyName"
  height={300}
/>
```

### PieChartComponent
```tsx
<PieChartComponent
  data={array}
  height={300}
/>
```

## 🧪 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile: iOS 12+, Android 8+

## 🚀 Deployment

### Deploy to Vercel
```bash
git push origin main
```

The project is optimized for Vercel:
- Automatic build optimization
- Edge functions ready
- Environment variables support
- Analytics integration

### Build for Production
```bash
pnpm build
pnpm start
```

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Getting started and setup guide
- **[DASHBOARD_FEATURES.md](./DASHBOARD_FEATURES.md)** - Detailed feature documentation
- **[README.md](./README.md)** - This file

## 🔧 Configuration

### Environment Variables
Create `.env.local`:
```env
# Add any API endpoints
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Customize Theme
Edit `/app/globals.css` to modify colors:
```css
--teal-primary: oklch(0.535 0.168 200);
--orange-accent: oklch(0.645 0.195 61);
```

## 🐛 Troubleshooting

### Routes returning 404
- Check page files exist in correct directory structure
- Verify `DashboardLayout` wraps page content
- Clear `.next` folder: `rm -rf .next`

### Animations not working
- Check Framer Motion is installed
- Verify `'use client'` directive at top of component
- Ensure imports: `import { motion } from 'framer-motion'`

### Styling issues
- Verify `<html className="dark">` in layout
- Check design tokens in globals.css
- Clear Tailwind cache: `rm -rf .next`

## 📝 License

This project is provided as-is for demonstration purposes.

## 🤝 Contributing

Feel free to customize and extend this dashboard for your needs!

## 📧 Support

For questions or issues:
1. Check the documentation files
2. Review example implementations in existing pages
3. Refer to Next.js and Framer Motion documentation

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org)

---

Built with ❤️ using Next.js, React, and Framer Motion.
