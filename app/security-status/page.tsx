'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/shared/Card';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { threatMetrics } from '@/lib/mockData';
import { FormModal, FormInput, FormSelect, ConfirmDialog } from '@/components/forms';
import { useModal } from '@/hooks/useModal';
import { useCRUD } from '@/hooks/useCRUD';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Zap, Lock, Plus, Edit2, Trash2, Check } from 'lucide-react';

interface Incident {
  id: string;
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  timestamp: string;
  status: 'Resolved' | 'Under Review' | 'Investigating' | 'Monitoring';
  platform: string;
  notes?: string;
}

const attackVectorData = [
  { vector: 'Network-based Attacks', count: 245, trend: '+12%', severity: 'High' },
  { vector: 'Social Engineering', count: 189, trend: '+8%', severity: 'High' },
  { vector: 'Malware Distribution', count: 156, trend: '-5%', severity: 'Critical' },
  { vector: 'Data Exfiltration', count: 92, trend: '+3%', severity: 'High' },
  { vector: 'Insider Threats', count: 34, trend: '+2%', severity: 'Critical' },
];

const systemHealthData = [
  { system: 'Firewall', status: 'Operational', uptime: '99.99%', lastChecked: '2 min ago' },
  { system: 'IDS/IPS', status: 'Operational', uptime: '99.95%', lastChecked: '5 min ago' },
  { system: 'EDR Agents', status: 'Degraded', uptime: '98.50%', lastChecked: '1 min ago' },
  { system: 'Email Gateway', status: 'Operational', uptime: '99.98%', lastChecked: '3 min ago' },
  { system: 'DNS Filtering', status: 'Operational', uptime: '99.99%', lastChecked: '2 min ago' },
];

export default function SecurityStatusPage() {
  const { items: incidents, loading, error, apiCreate, apiUpdate, apiDelete } = useCRUD<Incident>('/api/incidents');
  const [formData, setFormData] = useState<Partial<Incident>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { openModal, closeModal, isOpen } = useModal();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.type?.trim()) newErrors.type = 'Incident type is required';
    if (!formData.platform?.trim()) newErrors.platform = 'Platform is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenCreate = () => {
    setFormData({ type: '', severity: 'Medium', status: 'Under Review', platform: '' });
    setErrors({});
    openModal('create-incident');
  };

  const handleOpenEdit = (incident: Incident) => {
    setFormData(incident);
    setErrors({});
    openModal('edit-incident');
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    await apiCreate({
      type: formData.type!,
      severity: formData.severity as Incident['severity'],
      timestamp: new Date().toISOString(),
      status: formData.status as Incident['status'],
      platform: formData.platform!,
      notes: formData.notes,
    });
    closeModal('create-incident');
  };

  const handleUpdate = async () => {
    if (!validateForm() || !formData.id) return;
    await apiUpdate(formData.id, formData);
    closeModal('edit-incident');
  };

  const handleResolve = async (id: string) => {
    await apiUpdate(id, { status: 'Resolved' });
  };

  const handleDelete = async () => {
    if (deleteId) {
      await apiDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <DashboardLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        {error && (
          <div className="p-4 rounded-lg bg-red-critical/10 border border-red-critical/30 text-red-critical text-sm">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Critical Threats" value={threatMetrics.critical} change="+5 today" isPositive={false} variant="critical" icon={<AlertTriangle size={32} />} />
          <StatCard label="High Priority" value={threatMetrics.high} change="-3 today" isPositive={true} variant="warning" icon={<Zap size={32} />} />
          <StatCard label="Active Incidents" value={incidents.filter(i => i.status !== 'Resolved').length} change="-8%" isPositive={true} icon={<Shield size={32} />} />
          <StatCard label="Security Events" value={threatMetrics.totalThreats} change="+12%" isPositive={false} icon={<Lock size={32} />} />
        </motion.div>

        {/* Incidents Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Security Incidents</h2>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
          >
            <Plus size={18} /> Log Incident
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Incidents Table */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card title="Recent Security Incidents" subtitle="All detected threats and incidents">
              {loading ? (
                <div className="py-12 text-center text-muted-foreground">Loading incidents...</div>
              ) : (
                <DataTable
                  columns={[
                    { key: 'type', label: 'Incident Type', width: '25%' },
                    {
                      key: 'severity', label: 'Severity', width: '12%',
                      render: (value: string) => (
                        <Badge variant={value === 'Critical' ? 'critical' : value === 'High' ? 'warning' : 'success'} size="sm">{value}</Badge>
                      ),
                    },
                    { key: 'timestamp', label: 'Timestamp', width: '18%' },
                    {
                      key: 'status', label: 'Status', width: '15%',
                      render: (value: string) => (
                        <Badge variant={value === 'Resolved' ? 'success' : value === 'Under Review' ? 'warning' : 'info'} size="sm">{value}</Badge>
                      ),
                    },
                    { key: 'platform', label: 'Platform', width: '15%' },
                    {
                      key: 'actions', label: 'Actions', width: '15%',
                      render: (_: unknown, row: Incident) => (
                        <div className="flex gap-2">
                          {row.status !== 'Resolved' && (
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                              onClick={() => handleResolve(row.id)}
                              className="p-1 text-green-success hover:bg-green-success/10 rounded transition-colors" title="Mark as Resolved"
                            >
                              <Check size={16} />
                            </motion.button>
                          )}
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                            onClick={() => handleOpenEdit(row)}
                            className="p-1 text-primary hover:bg-primary/10 rounded transition-colors"
                          >
                            <Edit2 size={16} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                            onClick={() => setDeleteId(row.id)}
                            className="p-1 text-red-critical hover:bg-red-critical/10 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      ),
                    },
                  ]}
                  data={incidents}
                  maxRows={10}
                />
              )}
            </Card>
          </motion.div>

          {/* Threat Summary */}
          <motion.div variants={itemVariants}>
            <Card title="Threat Summary" subtitle="Current status overview">
              <div className="space-y-4">
                {[
                  { label: 'Critical', value: threatMetrics.critical, color: 'text-red-critical' },
                  { label: 'High', value: threatMetrics.high, color: 'text-orange-accent' },
                  { label: 'Medium', value: threatMetrics.medium, color: 'text-purple-secondary' },
                  { label: 'Low', value: threatMetrics.low, color: 'text-green-success' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className={`font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Threats</span>
                    <span className="text-lg font-bold text-primary">{threatMetrics.totalThreats}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Attack Vectors */}
        <motion.div variants={itemVariants}>
          <Card title="Attack Vectors" subtitle="Identified threat vectors and methods">
            <DataTable
              columns={[
                { key: 'vector', label: 'Attack Vector', width: '40%' },
                { key: 'count', label: 'Detected', width: '15%', render: (value) => <span className="font-semibold text-primary">{value}</span> },
                { key: 'trend', label: 'Trend', width: '15%', render: (value) => <span className={value.includes('+') ? 'text-red-critical' : 'text-green-success'}>{value}</span> },
                { key: 'severity', label: 'Severity', width: '20%', render: (value: string) => <Badge variant={value === 'Critical' ? 'critical' : 'warning'} size="sm">{value}</Badge> },
              ]}
              data={attackVectorData}
              maxRows={10}
            />
          </Card>
        </motion.div>

        {/* System Health */}
        <motion.div variants={itemVariants}>
          <Card title="Security Systems Health" subtitle="Status of critical security components">
            <div className="space-y-3">
              {systemHealthData.map((system, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{system.system}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>Uptime: {system.uptime}</span>
                      <span>Last checked: {system.lastChecked}</span>
                    </div>
                  </div>
                  <Badge variant={system.status === 'Operational' ? 'success' : 'warning'} size="md">{system.status}</Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Create/Edit Modal */}
        <FormModal
          isOpen={isOpen('create-incident') || isOpen('edit-incident')}
          onClose={() => { closeModal('create-incident'); closeModal('edit-incident'); }}
          title={formData.id ? 'Edit Incident' : 'Log New Security Incident'}
          subtitle={formData.id ? 'Update incident details' : 'Report a new security incident'}
          size="lg"
          footer={
            <>
              <button onClick={() => { closeModal('create-incident'); closeModal('edit-incident'); }}
                className="px-4 py-2 rounded-md border border-border text-foreground hover:bg-border transition-colors"
              >Cancel</button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={formData.id ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors"
              >
                {formData.id ? 'Update' : 'Log'}
              </motion.button>
            </>
          }
        >
          <div className="space-y-4">
            <FormInput label="Incident Type" name="type" placeholder="e.g., Malware Detection"
              value={formData.type || ''} onChange={(v) => setFormData({ ...formData, type: v })} error={errors.type} required />
            <div className="grid grid-cols-2 gap-4">
              <FormSelect label="Severity" name="severity"
                options={[{ value: 'Critical', label: 'Critical' }, { value: 'High', label: 'High' }, { value: 'Medium', label: 'Medium' }, { value: 'Low', label: 'Low' }]}
                value={formData.severity || ''} onChange={(v) => setFormData({ ...formData, severity: v as Incident['severity'] })} required />
              <FormSelect label="Status" name="status"
                options={[{ value: 'Under Review', label: 'Under Review' }, { value: 'Investigating', label: 'Investigating' }, { value: 'Monitoring', label: 'Monitoring' }, { value: 'Resolved', label: 'Resolved' }]}
                value={formData.status || ''} onChange={(v) => setFormData({ ...formData, status: v as Incident['status'] })} required />
            </div>
            <FormInput label="Platform" name="platform" placeholder="e.g., Windows, Linux, Network"
              value={formData.platform || ''} onChange={(v) => setFormData({ ...formData, platform: v })} error={errors.platform} required />
          </div>
        </FormModal>

        <ConfirmDialog
          isOpen={deleteId !== null}
          title="Delete Incident"
          message="Are you sure you want to delete this incident record? This action cannot be undone."
          confirmText="Delete" cancelText="Cancel" isDangerous={true}
          onConfirm={handleDelete} onCancel={() => setDeleteId(null)}
        />
      </motion.div>
    </DashboardLayout>
  );
}
