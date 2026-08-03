import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function Register() {
  const { register, loading, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const errors = {};
    if (!form.name.trim()) errors.name = 'Full name is required';
    if (!form.email) errors.email = 'Email is required';
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }

    const result = await register(form.name, form.email, form.password);
    if (result.success) navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-100 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md animate-slide-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h1>
          <p className="mt-1 text-sm text-slate-500">Start tracking meetings with AI</p>
        </div>

        <Card>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setFieldErrors({ ...fieldErrors, name: undefined }); }}
              error={fieldErrors.name}
              placeholder="John Doe"
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => { setForm({ ...form, email: e.target.value }); setFieldErrors({ ...fieldErrors, email: undefined }); }}
              error={fieldErrors.email}
              placeholder="you@company.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => { setForm({ ...form, password: e.target.value }); setFieldErrors({ ...fieldErrors, password: undefined }); }}
              error={fieldErrors.password}
              placeholder="Min. 6 characters"
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setFieldErrors({ ...fieldErrors, confirmPassword: undefined }); }}
              error={fieldErrors.confirmPassword}
              placeholder="Repeat password"
              required
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
