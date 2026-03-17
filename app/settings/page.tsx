'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/shared/Card';
import { Toast } from '@/components/shared/Toast';
import { FormModal, FormInput } from '@/components/forms';
import { useModal } from '@/hooks/useModal';
import { useTheme } from 'next-themes';
import { userSettings as initialSettings } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Lock, Key, Edit2, Save } from 'lucide-react';

interface UserSettingsState {
  name: string;
  email: string;
  role: string;
  department: string;
  notifications: {
    criticalAlerts: boolean;
    weeklyReport: boolean;
    trainingReminders: boolean;
    incidentUpdates: boolean;
  };
  preferences: {
    theme: string;
    timezone: string;
    language: string;
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<UserSettingsState>(initialSettings);
  const [formData, setFormData] = useState<Partial<UserSettingsState>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  });
  const { openModal, closeModal, isOpen } = useModal();
  const { theme, setTheme } = useTheme();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette },
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

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: '', type: 'success', visible: false }), 3000);
  };

  const handleOpenProfileEdit = () => {
    setFormData({
      name: settings.name,
      email: settings.email,
      role: settings.role,
      department: settings.department,
    });
    setErrors({});
    openModal('edit-profile');
  };

  const validateProfileForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    if (!formData.role?.trim()) newErrors.role = 'Role is required';
    if (!formData.department?.trim()) newErrors.department = 'Department is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = () => {
    if (!validateProfileForm()) return;
    setSettings({
      ...settings,
      name: formData.name!,
      email: formData.email!,
      role: formData.role!,
      department: formData.department!,
    });
    closeModal('edit-profile');
    showToast('Profile updated successfully', 'success');
  };

  const handleNotificationChange = (key: keyof typeof settings.notifications) => {
    const updated = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    };
    setSettings(updated);
    showToast('Notification preferences updated', 'success');
  };

  const handlePreferencesChange = (key: keyof typeof settings.preferences, value: string) => {
    if (key === 'theme') setTheme(value === 'auto' ? 'system' : value);
    const updated = {
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value,
      },
    };
    setSettings(updated);
    showToast('Preferences updated', 'success');
  };

  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      showToast('Please fill in all password fields', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    setNewPassword('');
    setConfirmPassword('');
    setShowChangePassword(false);
    showToast('Password changed successfully', 'success');
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Toast Notification */}
        {toast.visible && (
          <Toast message={toast.message} type={toast.type} duration={3000} />
        )}

        {/* Page Header */}
        <motion.div variants={itemVariants}>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <div className="flex gap-2 border-b border-border overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: -2 }}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card title="Personal Information" subtitle="Your account details">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-primary to-purple-secondary flex items-center justify-center text-white text-2xl font-bold">
                      {settings.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{settings.name}</h3>
                      <p className="text-sm text-muted-foreground">{settings.email}</p>
                      <button className="mt-2 px-3 py-1 text-sm bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors">
                        Change Avatar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-card rounded-lg border border-border">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                      <p className="text-foreground font-medium">{settings.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <p className="text-foreground font-medium">{settings.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                      <p className="text-foreground font-medium">{settings.role}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Department</label>
                      <p className="text-foreground font-medium">{settings.department}</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleOpenProfileEdit}
                    className="w-full mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </motion.button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card title="Notification Preferences" subtitle="Choose what notifications you receive">
                <div className="space-y-4">
                  {[
                    {
                      key: 'criticalAlerts',
                      label: 'Critical Security Alerts',
                      description: 'Receive notifications for critical threats and vulnerabilities',
                    },
                    {
                      key: 'weeklyReport',
                      label: 'Weekly Security Reports',
                      description: 'Receive a summary of security events every week',
                    },
                    {
                      key: 'trainingReminders',
                      label: 'Training Reminders',
                      description: 'Get notified about upcoming training deadlines',
                    },
                    {
                      key: 'incidentUpdates',
                      label: 'Incident Updates',
                      description: 'Receive updates on ongoing security incidents',
                    },
                  ].map((item) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            settings.notifications[item.key as keyof typeof settings.notifications]
                          }
                          onChange={() => handleNotificationChange(item.key as keyof typeof settings.notifications)}
                          className="sr-only"
                        />
                        <div className="w-11 h-6 bg-card border border-border rounded-full transition-colors relative">
                          <motion.div
                            animate={{
                              x: settings.notifications[item.key as keyof typeof settings.notifications]
                                ? 22
                                : 2,
                              backgroundColor: settings.notifications[item.key as keyof typeof settings.notifications]
                                ? '#14b8a6'
                                : '#9ca3af',
                            }}
                            className="w-5 h-5 rounded-full absolute top-0.5 transition-all"
                          />
                        </div>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card
                title="Change Password"
                subtitle="Keep your account secure"
                action={<Lock size={24} className="text-primary opacity-50" />}
              >
                <div className="space-y-4">
                  {!showChangePassword ? (
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <p className="font-medium text-foreground">Password</p>
                        <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowChangePassword(true)}
                        className="px-4 py-2 bg-primary/20 text-primary rounded-lg font-medium hover:bg-primary/30 transition-colors flex items-center gap-2"
                      >
                        <Key size={16} />
                        Change
                      </motion.button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary/50"
                        />
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setShowChangePassword(false);
                            setNewPassword('');
                            setConfirmPassword('');
                          }}
                          className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-border transition-colors"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleChangePassword}
                          className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Save size={16} />
                          Update Password
                        </motion.button>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card title="Two-Factor Authentication" subtitle="Add an extra layer of security">
                <div className="space-y-4">
                  <p className="text-sm text-foreground">
                    Two-factor authentication adds an extra layer of security to your account by
                    requiring a verification code in addition to your password.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
                  >
                    Enable 2FA
                  </motion.button>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card title="Active Sessions" subtitle="Manage your active sessions">
                <div className="space-y-2">
                  {[
                    { device: 'Chrome - Windows', location: 'New York, USA', lastActive: 'Now' },
                    { device: 'Safari - iPhone', location: 'San Francisco, USA', lastActive: '2 hours ago' },
                    { device: 'Firefox - Linux', location: 'Boston, USA', lastActive: '1 day ago' },
                  ].map((session, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                      <div>
                        <p className="font-medium text-foreground">{session.device}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.location} • {session.lastActive}
                        </p>
                      </div>
                      <button className="text-sm text-red-critical hover:underline">Logout</button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card title="Display Preferences" subtitle="Customize your viewing experience">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Theme</label>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <p className="font-medium text-foreground">{settings.preferences.theme}</p>
                        <p className="text-sm text-muted-foreground">Currently selected theme</p>
                      </div>
                      <select
                        value={theme === 'system' ? 'auto' : (theme ?? 'dark')}
                        onChange={(e) => handlePreferencesChange('theme', e.target.value)}
                        className="px-3 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary/50"
                      >
                        <option value="dark">Dark (Default)</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Timezone</label>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <p className="font-medium text-foreground">{settings.preferences.timezone}</p>
                        <p className="text-sm text-muted-foreground">Your timezone for scheduling</p>
                      </div>
                      <select
                        value={settings.preferences.timezone}
                        onChange={(e) => handlePreferencesChange('timezone', e.target.value)}
                        className="px-3 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary/50"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">EST</option>
                        <option value="CST">CST</option>
                        <option value="PST">PST</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Language</label>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <p className="font-medium text-foreground">{settings.preferences.language}</p>
                        <p className="text-sm text-muted-foreground">Language for the interface</p>
                      </div>
                      <select
                        value={settings.preferences.language}
                        onChange={(e) => handlePreferencesChange('language', e.target.value)}
                        className="px-3 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary/50"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Profile Modal */}
        <FormModal
          isOpen={isOpen('edit-profile')}
          onClose={() => closeModal('edit-profile')}
          title="Edit Profile"
          subtitle="Update your personal information"
          size="lg"
          footer={
            <>
              <button
                onClick={() => closeModal('edit-profile')}
                className="px-4 py-2 rounded-md border border-border text-foreground hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md font-medium transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                Save Changes
              </motion.button>
            </>
          }
        >
          <div className="space-y-4">
            <FormInput
              label="Full Name"
              name="name"
              placeholder="Your full name"
              value={formData.name || ''}
              onChange={(value) => setFormData({ ...formData, name: value })}
              error={errors.name}
              required
            />
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email || ''}
              onChange={(value) => setFormData({ ...formData, email: value })}
              error={errors.email}
              required
            />
            <FormInput
              label="Role"
              name="role"
              placeholder="Your job title"
              value={formData.role || ''}
              onChange={(value) => setFormData({ ...formData, role: value })}
              error={errors.role}
              required
            />
            <FormInput
              label="Department"
              name="department"
              placeholder="Your department"
              value={formData.department || ''}
              onChange={(value) => setFormData({ ...formData, department: value })}
              error={errors.department}
              required
            />
          </div>
        </FormModal>
      </motion.div>
    </DashboardLayout>
  );
}
