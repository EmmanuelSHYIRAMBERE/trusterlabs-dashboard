'use client';

import { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { DataTable } from '@/components/shared/DataTable';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { FormModal, FormInput, FormSelect, ConfirmDialog } from '@/components/forms';
import { useModal } from '@/hooks/useModal';
import { useCRUD } from '@/hooks/useCRUD';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Clock, Star, Plus, Edit2, Trash2 } from 'lucide-react';

interface InternshipApplication {
  id: string;
  name: string;
  email: string;
  position: string;
  appliedDate: string;
  status: 'New Application' | 'Under Review' | 'Interview Scheduled' | 'Offer Extended' | 'Rejected';
  rating: number;
  notes?: string;
}

export default function InternshipsPage() {
  const { items: applications, loading, error, apiCreate, apiUpdate, apiDelete } = useCRUD<InternshipApplication>('/api/internships');
  const [formData, setFormData] = useState<Partial<InternshipApplication>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { openModal, closeModal, isOpen } = useModal();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalApplications = applications.length;
  const pendingApplications = applications.filter((a) => a.status === 'New Application').length;
  const offersExtended = applications.filter((a) => a.status === 'Offer Extended').length;
  const avgRating = applications.length
    ? (applications.reduce((s, a) => s + a.rating, 0) / applications.length).toFixed(1)
    : '0.0';

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Applicant name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    if (!formData.position?.trim()) newErrors.position = 'Position is required';
    if ((formData.rating ?? 0) < 0 || (formData.rating ?? 0) > 5) newErrors.rating = 'Rating must be 0–5';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenCreate = () => {
    setFormData({ name: '', email: '', position: '', status: 'New Application', rating: 0 });
    setErrors({});
    openModal('create-application');
  };

  const handleOpenEdit = (app: InternshipApplication) => {
    setFormData(app);
    setErrors({});
    openModal('edit-application');
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    await apiCreate({
      name: formData.name!,
      email: formData.email!,
      position: formData.position!,
      appliedDate: new Date().toISOString(),
      status: formData.status as InternshipApplication['status'],
      rating: formData.rating!,
      notes: formData.notes,
    });
    closeModal('create-application');
  };

  const handleUpdate = async () => {
    if (!validateForm() || !formData.id) return;
    await apiUpdate(formData.id, formData);
    closeModal('edit-application');
  };

  const handleDelete = async () => {
    if (deleteId) {
      await apiDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        {error && (
          <div className="p-4 rounded-lg bg-red-critical/10 border border-red-critical/30 text-red-critical text-sm">{error}</div>
        )}

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Applications" value={totalApplications} change="+4 this month" isPositive={true} icon={<Briefcase size={32} />} />
          <StatCard label="New Applications" value={pendingApplications} change="Need review" isPositive={false} icon={<Clock size={32} />} />
          <StatCard label="Offers Extended" value={offersExtended} change="Awaiting response" icon={<CheckCircle size={32} />} />
          <StatCard label="Avg Rating" value={`${avgRating}/5`} change="Excellent pool" isPositive={true} icon={<Star size={32} />} />
        </motion.div>

        {/* Pipeline */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Application Pipeline</h2>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
            >
              <Plus size={18} /> Add Application
            </motion.button>
          </div>
          <Card title="Pipeline Status" subtitle="Status distribution of all candidates">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'New Applications', count: pendingApplications, color: 'bg-blue-500' },
                { label: 'Under Review', count: applications.filter((a) => a.status === 'Under Review').length, color: 'bg-orange-accent' },
                { label: 'Interview Scheduled', count: applications.filter((a) => a.status === 'Interview Scheduled').length, color: 'bg-purple-secondary' },
                { label: 'Offers Extended', count: offersExtended, color: 'bg-green-success' },
              ].map((stage, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-all"
                >
                  <p className="text-sm text-muted-foreground mb-2">{stage.label}</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <p className="text-2xl font-bold text-foreground">{stage.count}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Applications Table */}
        <motion.div variants={itemVariants}>
          <Card title="All Applications" subtitle="Complete candidate information and status">
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Loading applications...</div>
            ) : (
              <DataTable
                columns={[
                  { key: 'name', label: 'Candidate Name', width: '20%' },
                  { key: 'position', label: 'Position', width: '22%' },
                  {
                    key: 'status', label: 'Status', width: '15%',
                    render: (value: string) => (
                      <Badge variant={value === 'Offer Extended' ? 'success' : value === 'Interview Scheduled' ? 'info' : value === 'Under Review' ? 'warning' : 'default'} size="sm">{value}</Badge>
                    ),
                  },
                  { key: 'appliedDate', label: 'Applied Date', width: '15%' },
                  {
                    key: 'rating', label: 'Rating', width: '15%',
                    render: (value: number) => (
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-primary">{value}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < Math.floor(value) ? 'fill-orange-accent text-orange-accent' : 'text-muted-foreground'} />
                          ))}
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: 'actions', label: 'Actions', width: '13%',
                    render: (_: unknown, row: InternshipApplication) => (
                      <div className="flex gap-2">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => handleOpenEdit(row)}
                          className="p-1 text-primary hover:bg-primary/10 rounded transition-colors"><Edit2 size={16} /></motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setDeleteId(row.id)}
                          className="p-1 text-red-critical hover:bg-red-critical/10 rounded transition-colors"><Trash2 size={16} /></motion.button>
                      </div>
                    ),
                  },
                ]}
                data={applications}
                maxRows={15}
              />
            )}
          </Card>
        </motion.div>

        {/* Top Candidates */}
        <motion.div variants={itemVariants}>
          <Card title="Top Candidates" subtitle="Highest rated applicants by position">
            <div className="space-y-3">
              {[...applications].sort((a, b) => b.rating - a.rating).slice(0, 5).map((candidate, idx) => (
                <motion.div key={candidate.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-primary to-purple-secondary flex items-center justify-center text-white font-bold">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground">{candidate.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={i < Math.floor(candidate.rating) ? 'fill-orange-accent text-orange-accent' : 'text-muted-foreground'} />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-primary">{candidate.rating}</span>
                    </div>
                    <Badge variant={candidate.status === 'Offer Extended' ? 'success' : candidate.status === 'Interview Scheduled' ? 'info' : 'warning'} size="md">
                      {candidate.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recently Applied */}
        <motion.div variants={itemVariants}>
          <Card title="Recently Applied" subtitle="Latest applicants">
            <div className="space-y-3">
              {[...applications].sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()).slice(0, 5).map((candidate, idx) => (
                <motion.div key={candidate.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-primary/5 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-foreground">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">{candidate.position}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(candidate.appliedDate).toLocaleDateString()}</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenEdit(candidate)}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
                  >Review</motion.button>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Create/Edit Modal */}
        <FormModal
          isOpen={isOpen('create-application') || isOpen('edit-application')}
          onClose={() => { closeModal('create-application'); closeModal('edit-application'); }}
          title={formData.id ? 'Edit Application' : 'Add New Application'}
          subtitle={formData.id ? 'Update applicant information' : 'Register a new internship application'}
          size="lg"
          footer={
            <>
              <button onClick={() => { closeModal('create-application'); closeModal('edit-application'); }}
                className="px-4 py-2 rounded-md border border-border text-foreground hover:bg-border transition-colors">Cancel</button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={formData.id ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors">
                {formData.id ? 'Update' : 'Create'}
              </motion.button>
            </>
          }
        >
          <div className="space-y-4">
            <FormInput label="Applicant Name" name="name" placeholder="Full name"
              value={formData.name || ''} onChange={(v) => setFormData({ ...formData, name: v })} error={errors.name} required />
            <FormInput label="Email" name="email" type="email" placeholder="applicant@email.com"
              value={formData.email || ''} onChange={(v) => setFormData({ ...formData, email: v })} error={errors.email} required />
            <FormInput label="Position Applied For" name="position" placeholder="e.g., Security Engineer Intern"
              value={formData.position || ''} onChange={(v) => setFormData({ ...formData, position: v })} error={errors.position} required />
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Rating (0–5)" name="rating" type="number" min="0" max="5" step="0.5"
                value={String(formData.rating ?? 0)} onChange={(v) => setFormData({ ...formData, rating: parseFloat(v) || 0 })} error={errors.rating} required />
              <FormSelect label="Status" name="status"
                options={[
                  { value: 'New Application', label: 'New Application' },
                  { value: 'Under Review', label: 'Under Review' },
                  { value: 'Interview Scheduled', label: 'Interview Scheduled' },
                  { value: 'Offer Extended', label: 'Offer Extended' },
                  { value: 'Rejected', label: 'Rejected' },
                ]}
                value={formData.status || ''} onChange={(v) => setFormData({ ...formData, status: v as InternshipApplication['status'] })} required />
            </div>
          </div>
        </FormModal>

        <ConfirmDialog
          isOpen={deleteId !== null} title="Delete Application"
          message="Are you sure you want to delete this application? This action cannot be undone."
          confirmText="Delete" cancelText="Cancel" isDangerous={true}
          onConfirm={handleDelete} onCancel={() => setDeleteId(null)}
        />
      </motion.div>
  );
}
