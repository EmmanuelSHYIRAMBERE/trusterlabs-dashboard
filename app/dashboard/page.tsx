'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/shared/StatCard';
import { Card } from '@/components/shared/Card';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/shared/Badge';
import { ThreatMetricsChart } from '@/components/shared/ThreatMetricsChart';
import { LineChartComponent } from '@/components/shared/LineChartComponent';
import { PieChartComponent } from '@/components/shared/PieChartComponent';
import {
  dashboardStats,
  securityScoreData,
  threatMetrics,
  incidentData,
  trainingData,
} from '@/lib/mockData';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, TrendingUp, Users, BookOpen, Briefcase, FileText, AlertTriangle as AlertIcon } from 'lucide-react';

export default function DashboardPage() {
  // Sample data for charts
  const threatTrendData = [
    { date: 'Mar 1', threats: 156 },
    { date: 'Mar 3', threats: 189 },
    { date: 'Mar 5', threats: 210 },
    { date: 'Mar 7', threats: 195 },
    { date: 'Mar 9', threats: 245 },
    { date: 'Mar 11', threats: 267 },
    { date: 'Mar 13', threats: 298 },
  ];

  const threatCategoryData = [
    { name: 'Malware', value: 350 },
    { name: 'Phishing', value: 280 },
    { name: 'Brute Force', value: 210 },
    { name: 'SQL Injection', value: 160 },
  ];

  const incidentColumns = [
    { key: 'type', label: 'Incident Type', width: '30%' },
    {
      key: 'severity',
      label: 'Severity',
      render: (value: string) => (
        <Badge
          variant={
            value === 'Critical'
              ? 'critical'
              : value === 'High'
              ? 'warning'
              : 'success'
          }
          size="sm"
        >
          {value}
        </Badge>
      ),
      width: '15%',
    },
    { key: 'timestamp', label: 'Timestamp', width: '20%' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge
          variant={
            value === 'Resolved'
              ? 'success'
              : value === 'Under Review'
              ? 'warning'
              : 'info'
          }
          size="sm"
        >
          {value}
        </Badge>
      ),
      width: '15%',
    },
    { key: 'platform', label: 'Platform', width: '20%' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <AlertIcon size={24} />,
                label: 'Log Incident',
                description: 'Report a security issue',
                href: '/security-status',
                color: 'bg-red-critical/10 hover:bg-red-critical/20 text-red-critical',
              },
              {
                icon: <BookOpen size={24} />,
                label: 'Create Course',
                description: 'Add training program',
                href: '/training',
                color: 'bg-teal-primary/10 hover:bg-teal-primary/20 text-teal-primary',
              },
              {
                icon: <Briefcase size={24} />,
                label: 'Review Application',
                description: 'Check internship apps',
                href: '/internships',
                color: 'bg-purple-secondary/10 hover:bg-purple-secondary/20 text-purple-secondary',
              },
              {
                icon: <FileText size={24} />,
                label: 'New Blog Post',
                description: 'Write a blog article',
                href: '/blog',
                color: 'bg-orange-accent/10 hover:bg-orange-accent/20 text-orange-accent',
              },
            ].map((action, idx) => (
              <motion.a
                key={idx}
                href={action.href}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-6 rounded-lg border border-border ${action.color} transition-all cursor-pointer`}
              >
                <div className="mb-3">{action.icon}</div>
                <h3 className="font-semibold mb-1">{action.label}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Security Score Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {dashboardStats.map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <StatCard
                label={stat.label}
                value={stat.value}
                change={stat.change}
                isPositive={stat.change?.includes('+') ?? false}
                variant={
                  stat.label.includes('Threats')
                    ? 'critical'
                    : stat.label.includes('Incidents')
                    ? 'warning'
                    : 'success'
                }
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Threats and Incidents */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            {/* Threat Trend */}
            <Card title="Threat Detection Trend" subtitle="Last 7 days">
              <div className="h-80">
                <LineChartComponent
                  data={threatTrendData}
                  dataKey="threats"
                  xKey="date"
                  height={300}
                />
              </div>
            </Card>

            {/* Recent Incidents */}
            <Card title="Recent Security Incidents" subtitle="Active threats and issues">
              <DataTable columns={incidentColumns} data={incidentData} maxRows={5} />
            </Card>
          </motion.div>

          {/* Right Column - Metrics */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Security Score */}
            <Card title="Security Score" subtitle="Current assessment">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 160 160"
                    >
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="rgba(139, 92, 246, 0.1)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        strokeDasharray={`${(securityScoreData.score / 100) * 440} 440`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient
                          id="scoreGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#14b8a6" />
                          <stop offset="100%" stopColor="#fa9c52" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">
                          {securityScoreData.score}
                        </div>
                        <div className="text-xs text-muted-foreground">out of 100</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="success" size="md">
                      {securityScoreData.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      {securityScoreData.trend} from last month
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Threat Metrics */}
            <Card title="Threat Distribution" subtitle="By severity level">
              <ThreatMetricsChart
                critical={threatMetrics.critical}
                high={threatMetrics.high}
                medium={threatMetrics.medium}
                low={threatMetrics.low}
                total={threatMetrics.totalThreats}
              />
            </Card>

            {/* Training Progress */}
            <Card title="Training Progress" subtitle="Employee compliance">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Completion Rate</span>
                    <span className="text-sm font-bold text-primary">
                      {trainingData.completionRate}%
                    </span>
                  </div>
                  <div className="h-2 bg-card rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${trainingData.completionRate}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-teal-primary to-orange-accent rounded-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-success">
                      {trainingData.completed}
                    </p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-accent">
                      {trainingData.inProgress}
                    </p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-critical">
                      {trainingData.pending}
                    </p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Threat Category Distribution */}
        <motion.div variants={itemVariants}>
          <Card title="Threat Categories" subtitle="Distribution by type">
            <div className="h-80">
              <PieChartComponent data={threatCategoryData} height={300} />
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
