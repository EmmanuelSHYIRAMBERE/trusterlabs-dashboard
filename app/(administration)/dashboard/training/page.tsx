"use client";

import { useState } from "react";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { StatCard } from "@/components/shared/StatCard";
import {
  FormModal,
  FormInput,
  FormTextarea,
  ConfirmDialog,
} from "@/components/forms";
import { useModal } from "@/hooks/useModal";
import { useCRUD } from "@/hooks/useCRUD";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  CheckCircle,
  Clock,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";

interface TrainingProgram {
  id: string;
  name: string;
  description: string;
  enrolled: number;
  completed: number;
  deadline: string;
  status: "Active" | "Inactive" | "Upcoming";
}

export default function TrainingPage() {
  const {
    items: programs,
    loading,
    error,
    apiCreate,
    apiUpdate,
    apiDelete,
  } = useCRUD<TrainingProgram>("/api/training");
  const [formData, setFormData] = useState<Partial<TrainingProgram>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { openModal, closeModal, isOpen } = useModal();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalEnrolled = programs.reduce((s, p) => s + p.enrolled, 0);
  const totalCompleted = programs.reduce((s, p) => s + p.completed, 0);
  const completionRate =
    totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 0;
  const activeCount = programs.filter((p) => p.status === "Active").length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Course name is required";
    if (!formData.description?.trim())
      newErrors.description = "Description is required";
    if (!formData.deadline?.trim()) newErrors.deadline = "Deadline is required";
    if ((formData.enrolled ?? 0) <= 0)
      newErrors.enrolled = "Enrollment must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      description: "",
      enrolled: 0,
      completed: 0,
      deadline: "",
      status: "Active",
    });
    setErrors({});
    openModal("create-program");
  };

  const handleOpenEdit = (program: TrainingProgram) => {
    setFormData({ ...program, deadline: program.deadline.split("T")[0] });
    setErrors({});
    openModal("edit-program");
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    await apiCreate({
      name: formData.name!,
      description: formData.description!,
      enrolled: formData.enrolled!,
      completed: formData.completed ?? 0,
      deadline: new Date(formData.deadline!).toISOString(),
      status: formData.status as TrainingProgram["status"],
    });
    closeModal("create-program");
  };

  const handleUpdate = async () => {
    if (!validateForm() || !formData.id) return;
    await apiUpdate(formData.id, {
      ...formData,
      deadline: formData.deadline
        ? new Date(formData.deadline).toISOString()
        : undefined,
    });
    closeModal("edit-program");
  };

  const handleDelete = async () => {
    if (deleteId) {
      await apiDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {error && (
        <div className="p-4 rounded-lg bg-red-critical/10 border border-red-critical/30 text-red-critical text-sm">
          {error}
        </div>
      )}

      {/* Quick Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <StatCard
          label="Courses Completed"
          value={totalCompleted}
          change="+12 this month"
          isPositive={true}
          icon={<CheckCircle size={32} />}
        />
        <StatCard
          label="Active Programs"
          value={activeCount}
          change={`${programs.length} total`}
          icon={<Clock size={32} />}
        />
        <StatCard
          label="Total Enrolled"
          value={totalEnrolled}
          change="Across all programs"
          isPositive={true}
          icon={<BookOpen size={32} />}
        />
        <StatCard
          label="Completion Rate"
          value={`${completionRate}%`}
          change="+4% from last month"
          isPositive={true}
          icon={<Users size={32} />}
        />
      </motion.div>

      {/* Progress Overview */}
      <motion.div variants={itemVariants}>
        <Card
          title="Overall Training Progress"
          subtitle="Organization-wide compliance status"
        >
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm font-bold text-primary">
                  {completionRate}%
                </span>
              </div>
              <div className="h-3 bg-card rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-teal-primary via-purple-secondary to-orange-accent rounded-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-success/10 border border-green-success/20">
                <p className="text-xs text-muted-foreground mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-success">
                  {totalCompleted}
                </p>
                <p className="text-xs text-muted-foreground mt-1">employees</p>
              </div>
              <div className="p-4 rounded-lg bg-orange-accent/10 border border-orange-accent/20">
                <p className="text-xs text-muted-foreground mb-1">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-orange-accent">
                  {totalEnrolled - totalCompleted}
                </p>
                <p className="text-xs text-muted-foreground mt-1">employees</p>
              </div>
              <div className="p-4 rounded-lg bg-teal-primary/10 border border-teal-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Programs</p>
                <p className="text-2xl font-bold text-teal-primary">
                  {programs.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">total</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Programs Grid */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">
            Available Training Programs
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
          >
            <Plus size={18} /> New Course
          </motion.button>
        </div>
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">
            Loading programs...
          </div>
        ) : (
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
                      variant={program.status === "Active" ? "success" : "info"}
                      size="md"
                    >
                      {program.status}
                    </Badge>
                  }
                >
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Completion
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          {program.enrolled > 0
                            ? Math.round(
                                (program.completed / program.enrolled) * 100,
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="h-2 bg-card rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${program.enrolled > 0 ? (program.completed / program.enrolled) * 100 : 0}%`,
                          }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className="h-full bg-gradient-to-r from-teal-primary to-green-success"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Enrolled
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {program.enrolled}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Completed
                        </p>
                        <p className="text-lg font-bold text-green-success">
                          {program.completed}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Deadline
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {new Date(program.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOpenEdit(program)}
                        className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit2 size={16} /> Edit
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
        )}
      </motion.div>

      {/* Upcoming Deadlines */}
      <motion.div variants={itemVariants}>
        <Card
          title="Upcoming Deadlines"
          subtitle="Critical training completion dates"
        >
          <div className="space-y-3">
            {[...programs]
              .filter((p) => p.status === "Active")
              .sort(
                (a, b) =>
                  new Date(a.deadline).getTime() -
                  new Date(b.deadline).getTime(),
              )
              .map((program, idx) => {
                const daysUntil = Math.ceil(
                  (new Date(program.deadline).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24),
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
                      <p className="font-medium text-foreground">
                        {program.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Deadline:{" "}
                        {new Date(program.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        daysUntil <= 7
                          ? "critical"
                          : daysUntil <= 14
                            ? "warning"
                            : "success"
                      }
                      size="md"
                    >
                      {daysUntil} days left
                    </Badge>
                  </motion.div>
                );
              })}
            {programs.filter((p) => p.status === "Active").length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No active programs
              </p>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Create/Edit Modal */}
      <FormModal
        isOpen={isOpen("create-program") || isOpen("edit-program")}
        onClose={() => {
          closeModal("create-program");
          closeModal("edit-program");
        }}
        title={
          formData.id ? "Edit Training Program" : "Create New Training Program"
        }
        subtitle={
          formData.id ? "Update program details" : "Add a new training course"
        }
        size="lg"
        footer={
          <>
            <button
              onClick={() => {
                closeModal("create-program");
                closeModal("edit-program");
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
              {formData.id ? "Update" : "Create"}
            </motion.button>
          </>
        }
      >
        <div className="space-y-4">
          <FormInput
            label="Course Name"
            name="name"
            placeholder="e.g., Phishing Awareness 2025"
            value={formData.name || ""}
            onChange={(v) => setFormData({ ...formData, name: v })}
            error={errors.name}
            required
          />
          <FormTextarea
            label="Description"
            name="description"
            placeholder="Describe the training program and its objectives"
            value={formData.description || ""}
            onChange={(v) => setFormData({ ...formData, description: v })}
            error={errors.description}
            required
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Enrolled"
              name="enrolled"
              type="number"
              value={String(formData.enrolled ?? 0)}
              onChange={(v) =>
                setFormData({ ...formData, enrolled: parseInt(v) || 0 })
              }
              error={errors.enrolled}
              required
            />
            <FormInput
              label="Completed"
              name="completed"
              type="number"
              value={String(formData.completed ?? 0)}
              onChange={(v) =>
                setFormData({ ...formData, completed: parseInt(v) || 0 })
              }
              required
            />
          </div>
          <FormInput
            label="Deadline"
            name="deadline"
            type="date"
            value={formData.deadline || ""}
            onChange={(v) => setFormData({ ...formData, deadline: v })}
            error={errors.deadline}
            required
          />
        </div>
      </FormModal>

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
  );
}
