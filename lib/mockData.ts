// Mock data for TrusterLabs Cybersecurity Dashboard

export const securityScoreData = {
  score: 78,
  trend: '+5%',
  status: 'Good',
  lastUpdated: '2 hours ago',
};

export const threatMetrics = {
  critical: 223,
  high: 269,
  medium: 458,
  low: 789,
  totalThreats: 1739,
  weekTrend: '+12%',
};

export const incidentData = [
  { id: 1, type: 'Malware Detection', severity: 'Critical', timestamp: '3:42 AM', status: 'Resolved', platform: 'Windows' },
  { id: 2, type: 'Suspicious Network Activity', severity: 'High', timestamp: '3:43 AM', status: 'Under Review', platform: 'Linux' },
  { id: 3, type: 'Unauthorized Access Attempt', severity: 'High', timestamp: '3:43 AM', status: 'Investigating', platform: 'macOS' },
  { id: 4, type: 'Failed Process Execution', severity: 'Medium', timestamp: '3:44 AM', status: 'Resolved', platform: 'Windows' },
  { id: 5, type: 'VPN Tunnel Disconnection', severity: 'Medium', timestamp: '3:44 AM', status: 'Monitoring', platform: 'Network' },
];

export const trainingData = {
  completed: 142,
  inProgress: 28,
  pending: 45,
  completionRate: 64,
  upcomingDeadline: '2025-04-15',
};

export const trainingPrograms = [
  {
    id: 1,
    name: 'Phishing Awareness 2025',
    description: 'Learn to identify and avoid phishing attacks',
    enrolled: 1245,
    completed: 892,
    deadline: '2025-04-15',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Data Protection Fundamentals',
    description: 'Essential data security practices and compliance',
    enrolled: 980,
    completed: 756,
    deadline: '2025-05-20',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Password Security Best Practices',
    description: 'Creating and managing strong passwords',
    enrolled: 2100,
    completed: 1850,
    deadline: '2025-04-30',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Incident Response Training',
    description: 'How to respond to security incidents',
    enrolled: 450,
    completed: 289,
    deadline: '2025-06-01',
    status: 'Upcoming',
  },
];

export const internshipApplications = [
  {
    id: 1,
    name: 'Zoe Watson',
    position: 'Security Research Intern',
    status: 'Under Review',
    appliedDate: '2025-03-10',
    email: 'zoe.watson@email.com',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Marcus Chen',
    position: 'Cybersecurity Analyst',
    status: 'Interview Scheduled',
    appliedDate: '2025-03-08',
    email: 'marcus.chen@email.com',
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    position: 'Threat Intelligence Intern',
    status: 'Offer Extended',
    appliedDate: '2025-03-05',
    email: 'sarah.johnson@email.com',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    position: 'Security Researcher',
    status: 'New Application',
    appliedDate: '2025-03-14',
    email: 'alex.rodriguez@email.com',
    rating: 4.3,
  },
];

export const analyticsData = {
  monthlyEvents: [
    { date: 'Mar 1', events: 2400 },
    { date: 'Mar 3', events: 2210 },
    { date: 'Mar 5', events: 2290 },
    { date: 'Mar 7', events: 2000 },
    { date: 'Mar 9', events: 2181 },
    { date: 'Mar 11', events: 2500 },
    { date: 'Mar 13', events: 2100 },
  ],
  threatsByCategory: [
    { name: 'Malware', value: 350 },
    { name: 'Phishing', value: 280 },
    { name: 'Brute Force', value: 210 },
    { name: 'SQL Injection', value: 160 },
  ],
  complianceStatus: {
    iso27001: { score: 92, trend: '+3%' },
    gdpr: { score: 88, trend: '+2%' },
    hipaa: { score: 95, trend: '+1%' },
    sox: { score: 85, trend: '+4%' },
  },
};

export const blogPosts = [
  {
    id: 1,
    title: 'Zero Trust Architecture: The Future of Cybersecurity',
    slug: 'zero-trust-architecture',
    author: 'Dr. Sarah Chen',
    status: 'Published',
    createdDate: '2025-03-10',
    views: 2450,
    engagement: 340,
  },
  {
    id: 2,
    title: 'Rising Threats in Cloud Security',
    slug: 'cloud-security-threats',
    author: 'James Mitchell',
    status: 'Draft',
    createdDate: '2025-03-12',
    views: 0,
    engagement: 0,
  },
  {
    id: 3,
    title: 'AI-Powered Threat Detection Explained',
    slug: 'ai-threat-detection',
    author: 'Emma Rodriguez',
    status: 'Scheduled',
    createdDate: '2025-03-08',
    views: 0,
    engagement: 0,
  },
];

export const userSettings = {
  name: 'Admin User',
  email: 'admin@trusterlabs.com',
  role: 'Security Administrator',
  department: 'Security Operations',
  notifications: {
    criticalAlerts: true,
    weeklyReport: true,
    trainingReminders: true,
    incidentUpdates: true,
  },
  preferences: {
    theme: 'dark',
    timezone: 'UTC',
    language: 'English',
  },
};

export const dashboardStats = [
  { label: 'Total Threats Detected', value: '1,739', change: '+12%', icon: 'AlertTriangle' },
  { label: 'Active Incidents', value: '23', change: '-8%', icon: 'Shield' },
  { label: 'System Uptime', value: '99.9%', change: '+0.2%', icon: 'CheckCircle' },
  { label: 'Compliance Score', value: '91%', change: '+2%', icon: 'TrendingUp' },
];
