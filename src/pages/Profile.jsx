import { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Save } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { getProfile, updateProfile } from '../services/api';

function buildFormFromUser(profile = {}) {
  return {
    name: profile.name || '',
    email: profile.email || '',
    avatar: profile.avatar || '',
    jobTitle: profile.jobTitle || '',
    phone: profile.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => buildFormFromUser(user));
  const [memberSince, setMemberSince] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const data = await getProfile();
        if (!active) return;
        const profile = data.user;
        setForm(buildFormFromUser(profile));
        if (profile.createdAt) {
          setMemberSince(new Date(profile.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }));
        }
      } catch (err) {
        if (active) {
          if (user) {
            setForm(buildFormFromUser(user));
          }
          addToast(err.message || 'Failed to load profile', 'error');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [addToast]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    if (form.newPassword && form.newPassword.length < 6) {
      next.newPassword = 'Password must be at least 6 characters';
    }
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      next.confirmPassword = 'Passwords do not match';
    }
    if (form.newPassword && !form.currentPassword) {
      next.currentPassword = 'Enter your current password';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        avatar: form.avatar.trim(),
        jobTitle: form.jobTitle.trim(),
        phone: form.phone.trim(),
      };

      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }

      const data = await updateProfile(payload);
      updateUser(data.user);
      setForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      addToast('Profile updated successfully', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="h-8 w-48 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="h-64 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
    );
  }

  const displayAvatar =
    form.avatar ||
    form.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ||
    user?.avatar ||
    'U';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile Settings</h2>
        <p className="text-sm text-slate-500">Manage your account information and password</p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white shrink-0">
            {displayAvatar}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{form.name || user?.name}</p>
            <p className="text-sm text-slate-500">{form.email || user?.email}</p>
            {memberSince && (
              <p className="text-xs text-slate-400 mt-1">Member since {memberSince}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Personal Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                placeholder="John Doe"
                required
                containerClassName="sm:col-span-2"
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                placeholder="you@company.com"
                required
                containerClassName="sm:col-span-2"
              />
              <Input
                label="Avatar Initials"
                value={form.avatar}
                onChange={(e) => handleChange('avatar', e.target.value.toUpperCase().slice(0, 3))}
                placeholder="JD"
                maxLength={3}
              />
              <Input
                label="Job Title"
                value={form.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                placeholder="Product Manager"
              />
              <Input
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 555 0100"
                containerClassName="sm:col-span-2"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Change Password</h3>
            <p className="text-sm text-slate-500 mb-4">Leave blank to keep your current password</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Current Password"
                type="password"
                value={form.currentPassword}
                onChange={(e) => handleChange('currentPassword', e.target.value)}
                error={errors.currentPassword}
                placeholder="••••••••"
                containerClassName="sm:col-span-2"
              />
              <Input
                label="New Password"
                type="password"
                value={form.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                error={errors.newPassword}
                placeholder="Min. 6 characters"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                placeholder="Repeat new password"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" icon={Save} loading={saving} size="lg">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3">
          <User className="h-5 w-5 text-primary-600" />
          <div>
            <p className="text-xs text-slate-500">Display Name</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{form.name}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary-600" />
          <div>
            <p className="text-xs text-slate-500">Email</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{form.email}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-primary-600" />
          <div>
            <p className="text-xs text-slate-500">Role</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {form.jobTitle || 'Not set'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
