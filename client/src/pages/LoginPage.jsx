import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Car, Sparkles, UserCheck, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setSubmitting(true);
    try {
      const loggedInUser = await login(email, password);
      toast.success(`Welcome back, ${loggedInUser.name}!`);

      if (loggedInUser.role === 'admin') {
        navigate(redirectPath.startsWith('/admin') ? redirectPath : '/admin');
      } else {
        navigate(redirectPath.startsWith('/admin') ? '/dashboard' : redirectPath);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCustomer = () => {
    setEmail('customer@driveease.com');
    setPassword('Customer@12345!');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@driveease.com');
    setPassword('Admin@SecureDrive2026!');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
            <Car className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to DriveEase
          </h2>
          <p className="text-xs text-slate-500">
            Access your bookings, profile, or administrator dashboard
          </p>
        </div>

        {/* Quick Demo Credentials Bar (Super handy for Viva) */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Quick Demo Autofill (Lab / Viva)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoCustomer}
              className="py-1.5 px-2 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:border-brand-300 rounded-lg shadow-2xs flex items-center justify-center gap-1 transition-all"
            >
              <UserCheck className="w-3 h-3 text-brand-600" />
              Customer Demo
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="py-1.5 px-2 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:border-brand-300 rounded-lg shadow-2xs flex items-center justify-center gap-1 transition-all"
            >
              <Shield className="w-3 h-3 text-purple-600" />
              Admin Demo
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 active:scale-95 disabled:opacity-50 transition-all shadow-md shadow-brand-500/20 flex items-center justify-center gap-2"
          >
            {submitting ? (
              'Authenticating...'
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
