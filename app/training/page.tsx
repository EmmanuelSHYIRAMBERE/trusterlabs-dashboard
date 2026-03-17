'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { trainingPrograms as initialPrograms, trainingData } from '@/lib/mockData';
import { FormModal, FormInput, FormTextarea, ConfirmDialog } from '@/components/forms';
import { useModal } from '@/hooks/useModal';
import { useCRUD } from '@/hooks/useCRUD';
import { motion } from 'framer-motion';
import { BookOpen, Users, CheckCircle, Clock, Plus, Edit2, Trash2 } from 'lucide-react';

interface TrainingProgram {
  id: number;
  name: string;
  description: string;
  enrolled: number;
  completed: number;
  deadline: string;
  status: 'Active' | 'Inactive' | 'Upcoming';
}

export default function TrainingPage() {
  const [programs, setPrograms] = useState<TrainingProgram[]>(initialPrograms as TrainingProgram[]);
  const [formData, setFormData] = useState<Partial<TrainingProgram>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { openModal, closeModal, isOpen, getModalData } = useModal();
  const [deleteId, setDeleteId] = useState<number | null>(null);

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Course name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.deadline?.trim()) newErrors.deadline = 'Deadline is required';
    if ((formData.enrolled ?? 0) <= 0) newErrors.enrolled = 'Enrollment must be greater than 0';
    if ((formData.completed ?? 0) < 0) newErrors.completed = 'Completed cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      description: '',
      enrolled: 0,
      completed: 0,
      deadline: '',
      status: 'Active',
    });
    setErrors({});
    openModal('create-program');
  };

  const handleOpenEdit = (program: TrainingProgram) => {
    setFormData(program);
    setErrors({});
    openModal('edit-program');
  };

  const handleCreate = () => {
    if (!validateForm()) return;
    const newProgram: TrainingProgram = {
      id: Math.max(...programs.map(p => p.id), 0) + 1,
      name: formData.name!,
      description: formData.description!,
      enrolled: formData.enrolled!,
      completed: formData.completed!,
      deadline: formData.deadline!,
      status: formData.status as 'Active' | 'Inactive',
    };
    setPrograms([...programs, newProgram]);
    closeModal('create-program');
  };

  const handleUpdate = () => {
    if (!validateForm()) return;
    setPrograms(
      programs.map((p) =>
        p.id === formData.id
          ? { ...p, ...formData }
          : p
      )
    );
    closeModal('edit-program');
  };

  const handleDelete = () => {
    if (deleteId) {
      setPrograms(programs.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Courses Completed"
            value={trainingData.completed}
            change="+12 this month"
            isPositive={true}
            icon={<CheckCircle size={32} />}
          />
          <StatCard
            label="In Progress"
            value={trainingData.inProgress}
            change={`${Math.round((trainingData.inProgress / (trainingData.completed + trainingData.inProgress + trainingData.pending)) * 100)}%`}
            icon={<Clock size={32} />}
          />
          <StatCard
            label="Pending"
            value={trainingData.pending}
            change="Due soon"
            isPositive={false}
            icon={<BookOpen size={32} />}
          />
          <StatCard
            label="Completion Rate"
            value={`${trainingData.completionRate}%`}
            change="+4% from last month"
            isPositive={true}
            icon={<Users size={32} />}
          />
        </motion.div>

        {/* Progress Overview */}
        <motion.div variants={itemVariants}>
          <Card title="Overall Training Progress" subtitle="Organization-wide compliance status">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm font-bold text-primary">{trainingData.completionRate}%</span>
                </div>
                <div className="h-3 bg-card rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${trainingData.completionRate}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-teal-primary via-purple-secondary to-orange-accent rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-green-success/10 border border-green-success/20">
                  <p className="text-xs text-muted-foreground mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-success">{trainingData.completed}</p>
                  <p className="text-xs text-muted-foreground mt-1">employees</p>
                </div>
                <div className="p-4 rounded-lg bg-orange-accent/10 border border-orange-accent/20">
                  <p className="text-xs text-muted-foreground mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-orange-accent">{trainingData.inProgress}</p>
                  <p className="text-xs text-muted-foreground mt-1">employees</p>
                </div>
                <div className="p-4 rounded-lg bg-red-critical/10 border border-red-critical/20">
                  <p className="text-xs text-muted-foreground mb-1">Pending</p>
                  <p className="text-2xl font-bold text-red-critical">{trainingData.pending}</p>
                  <p className="text-xs text-muted-foreground mt-1">employees</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Training Programs Grid */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Available Training Programs</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
            >
              <Plus size={18} />
              New Course
            </motion.button>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            {programs.map((program, idx) => (
              <motion.div key={program.id} variants={itemVariants}>
                <Card
                  className="h-full cursor-pointer hover:border-primary/50 transition-all"
                  title={program.name}
                  subtitle={program.description}
                  action={
                    <Badge
                      variant={program.status === 'Active' ? 'success' : 'info'}
                      size="md"
                    >
                      {program.status}
                    </Badge>
                  }
                >
                  <div className="space-y-4">
                    {/* Enrollment Progress */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Completion</span>
                        <span className="text-sm font-semibold text-primary">
                          {Math.round((program.completed / program.enrolled) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-card rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(program.completed / program.enrolled) * 100}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className="h-full bg-gradient-to-r from-teal-primary to-green-success"
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Enrolled</p>
                        <p className="text-lg font-bold text-foreground">{program.enrolled}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Completed</p>
                        <p className="text-lg font-bold text-green-success">{program.completed}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                        <p className="text-sm font-semibold text-foreground">{program.deadline}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOpenEdit(program)}
                        className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit2 size={16} />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setDeleteId(program.id)}
                        className="px-4 py-2 bg-red-critical/10 hover:bg-red-critical/20 text-red-critical rounded-lg font-medium transition-colors"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div variants={itemVariants}>
          <Card title="Upcoming Deadlines" subtitle="Critical training completion dates">
            <div className="space-y-3">
              {programs
                .filter((p) => p.status === 'Active')
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                .map((program, idx) => {
                  const daysUntil = Math.ceil(
                    (new Date(program.deadline).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <motion.div
                      key={program.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{program.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Deadline: {program.deadline}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            daysUntil <= 7
                              ? 'critical'
                              : daysUntil <= 14
                              ? 'warning'
                              : 'success'
                          }
                          size="md"
                        >
                          {daysUntil} days left
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </Card>
        </motion.div>

        {/* Create/Edit Program Modal */}
        <FormModal
          isOpen={isOpen('create-program') || isOpen('edit-program')}
          onClose={() => {
            closeModal('create-program');
            closeModal('edit-program');
          }}
          title={formData.id ? 'Edit Training Program' : 'Create New Training Program'}
          subtitle={formData.id ? 'Update program details' : 'Add a new training course'}
          size="lg"
          footer={
            <>
              <button
                onClick={() => {
                  closeModal('create-program');
                  closeModal('edit-program');
                }}
                className="px-4 py-2 rounded-md border border-border text-foreground hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={formData.id ? handleUpdate : handleCreate}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors"
              >
                {formData.id ? 'Update' : 'Create'}
              </motion.button>
            </>
          }
        >
          <div className="space-y-4">
            <FormInput
              label="Course Name"
              name="name"
              placeholder="e.g., Phishing Awareness 2025"
              value={formData.name || ''}
              onChange={(value) => setFormData({ ...formData, name: value })}
              error={errors.name}
              required
            />
            <FormTextarea
              label="Description"
              name="description"
              placeholder="Describe the training program and its objectives"
              value={formData.description || ''}
              onChange={(value) => setFormData({ ...formData, description: value })}
              error={errors.description}
              required
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Enrolled"
                name="enrolled"
                type="number"
                value={String(formData.enrolled || 0)}
                onChange={(value) => setFormData({ ...formData, enrolled: parseInt(value) || 0 })}
                error={errors.enrolled}
                required
              />
              <FormInput
                label="Completed"
                name="completed"
                type="number"
                value={String(formData.completed || 0)}
                onChange={(value) => setFormData({ ...formData, completed: parseInt(value) || 0 })}
                error={errors.completed}
                required
              />
            </div>
            <FormInput
              label="Deadline"
              name="deadline"
              type="date"
              value={formData.deadline || ''}
              onChange={(value) => setFormData({ ...formData, deadline: value })}
              error={errors.deadline}
              required
            />
          </div>
        </FormModal>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteId !== null}
          title="Delete Training Program"
          message="Are you sure you want to delete this training program? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isDangerous={true}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      </motion.div>
    </DashboardLayout>
  );
}
