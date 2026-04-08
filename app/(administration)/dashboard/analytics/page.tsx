"use client";

import { Card } from "@/components/shared/Card";
import { StatCard } from "@/components/shared/StatCard";
import { PieChartComponent } from "@/components/shared/PieChartComponent";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  // Chart data
  const weeklyThreatData = [
    { date: "Monday", events: 240, resolved: 180 },
    { date: "Tuesday", events: 221, resolved: 165 },
    { date: "Wednesday", events: 229, resolved: 172 },
    { date: "Thursday", events: 200, resolved: 150 },
    { date: "Friday", events: 218, resolved: 164 },
    { date: "Saturday", events: 250, resolved: 188 },
    { date: "Sunday", events: 298, resolved: 225 },
  ];

  const complianceData = [
    { framework: "ISO 27001", score: 92 },
    { framework: "GDPR", score: 88 },
    { framework: "HIPAA", score: 95 },
    { framework: "SOX", score: 85 },
  ];

  const threatByDepartment = [
    { department: "IT", threats: 125, resolved: 98 },
    { department: "Finance", threats: 87, resolved: 72 },
    { department: "HR", threats: 64, resolved: 58 },
    { department: "Sales", threats: 156, resolved: 124 },
    { department: "Operations", threats: 95, resolved: 78 },
  ];

  const topThreats = [
    { name: "Phishing Emails", value: 280, percentage: 35 },
    { name: "Malware", value: 220, percentage: 27 },
    { name: "Brute Force", value: 175, percentage: 22 },
    { name: "Zero-Days", value: 125, percentage: 16 },
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Key Metrics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <StatCard
          label="Total Events This Week"
          value="1,856"
          change="+12%"
          isPositive={false}
        />
        <StatCard
          label="Avg Resolution Time"
          value="2.4h"
          change="-0.5h"
          isPositive={true}
        />
        <StatCard
          label="Compliance Score"
          value="91%"
          change="+2%"
          isPositive={true}
        />
        <StatCard
          label="Detection Accuracy"
          value="96.8%"
          change="+1.2%"
          isPositive={true}
        />
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Threat Trend */}
        <motion.div variants={itemVariants}>
          <Card
            title="Weekly Threat Activity"
            subtitle="Events detected vs resolved"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyThreatData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(139, 92, 246, 0.1)"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255, 255, 255, 0.4)"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="rgba(255, 255, 255, 0.4)"
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(20, 20, 30, 0.9)",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="events" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                  <Bar
                    dataKey="resolved"
                    fill="#4ade80"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Compliance Status */}
        <motion.div variants={itemVariants}>
          <Card
            title="Compliance Frameworks"
            subtitle="Audit score by framework"
          >
            <div className="space-y-4">
              {complianceData.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {item.framework}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {item.score}%
                    </span>
                  </div>
                  <div className="h-3 bg-card rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.8, delay: 0.1 + idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-teal-primary to-green-success rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Threats by Department */}
        <motion.div variants={itemVariants}>
          <Card
            title="Threats by Department"
            subtitle="Incident distribution across teams"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={threatByDepartment} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(139, 92, 246, 0.1)"
                  />
                  <XAxis
                    type="number"
                    stroke="rgba(255, 255, 255, 0.4)"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    dataKey="department"
                    type="category"
                    stroke="rgba(255, 255, 255, 0.4)"
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(20, 20, 30, 0.9)",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="threats" fill="#fa9c52" radius={[0, 8, 8, 0]} />
                  <Bar
                    dataKey="resolved"
                    fill="#4ade80"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Top Threats Distribution */}
        <motion.div variants={itemVariants}>
          <Card
            title="Top Threat Categories"
            subtitle="Distribution of threat types"
          >
            <div className="h-80">
              <PieChartComponent
                data={topThreats}
                colors={["#14b8a6", "#fa9c52", "#8b5cf6", "#ef4444"]}
                height={300}
              />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Metrics Table */}
      <motion.div variants={itemVariants}>
        <Card
          title="Detailed Metrics"
          subtitle="Comprehensive statistics and trends"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Metric
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                    Current
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                    Last Week
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    metric: "Incidents Detected",
                    current: 156,
                    last: 142,
                    trend: "+9.9%",
                  },
                  {
                    metric: "Avg Resolution Time",
                    current: "2.4h",
                    last: "2.8h",
                    trend: "-14.3%",
                  },
                  {
                    metric: "False Positives",
                    current: 23,
                    last: 31,
                    trend: "-25.8%",
                  },
                  {
                    metric: "System Uptime",
                    current: "99.98%",
                    last: "99.95%",
                    trend: "+0.03%",
                  },
                  {
                    metric: "Vulnerabilities Found",
                    current: 12,
                    last: 15,
                    trend: "-20.0%",
                  },
                ].map((row, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-border/50 hover:bg-primary/5"
                  >
                    <td className="px-4 py-3 text-foreground">{row.metric}</td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      {row.current}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {row.last}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold ${row.trend.includes("-") ? "text-green-success" : "text-orange-accent"}`}
                    >
                      {row.trend}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
