import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import {
  Train,
  ShieldCheck,
  Lock,
  User,
  Building2,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  Database,
  Code2
} from 'lucide-react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile, selectedRole?: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [portalId, setPortalId] = useState('NLCI-7842');
  const [username, setUsername] = useState('srivenkata');
  const [password, setPassword] = useState('Nlci@2026#Dev');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalId.trim() || !username.trim() || !password.trim()) {
      setError('Please fill in all required credentials.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      const user: UserProfile = {
        username: username.trim(),
        employeeName: 'Srivenkata Kishore',
        portalId: portalId.trim().toUpperCase(),
        email: `${username.trim().toLowerCase()}@nlci.com`,
        department: '.NET Enterprise Engineering',
        role: 'admin',
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onLoginSuccess(user);
    }, 500);
  };

  const handleQuickLogin = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const isViewer = role === 'viewer';
      const user: UserProfile = {
        username: isViewer ? 'viewer.guest' : 'srivenkata.admin',
        employeeName: isViewer ? 'Auditor Guest (Viewer)' : 'Srivenkata Kishore (Admin)',
        portalId: 'NLCI-7842',
        email: isViewer ? 'viewer@nlci.com' : 'srivenkatakishoren@gmail.com',
        department: isViewer ? 'Quality Assurance & Audit' : '.NET Enterprise Engineering',
        role,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onLoginSuccess(user, role);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F3F2F1] text-[#2B2D2D] flex flex-col justify-center items-center px-4 py-12 relative font-sans">
      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg bg-white border border-[#D8D5D1] rounded-3xl shadow-xl p-6 sm:p-10 relative z-10"
      >
        {/* Top Branding Banner */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-[#D8F9B8] text-[#2B2D2D] rounded-2xl flex items-center justify-center font-bold shadow-sm mb-4">
            <Train className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-2 bg-[#F7F7F7] rounded-full px-3 py-1 border border-[#E6E6E6] mb-2">
            <div className="w-2 h-2 rounded-full bg-[#2B2D2D] animate-pulse" />
            <span className="text-xs font-semibold text-[#2B2D2D]">NLCI .NET Train Booking Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2D2D] tracking-tight">
            Enterprise Login Portal
          </h1>
          <p className="text-xs text-[#666666] mt-1 max-w-md">
            ASP.NET Web Application • ADO.NET SqlClient DAL Engine
          </p>
        </div>

        {/* Quick Demo Role Logins */}
        <div className="mb-6 p-4 bg-[#F7F7F7] rounded-2xl border border-[#E6E6E6]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2B2D2D]">
              <Sparkles className="w-4 h-4 text-[#2B2D2D]" />
              <span>Quick Role Demo Logins</span>
            </div>
            <span className="text-[10px] text-[#666666] font-mono">1-Click Access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Quick Admin Login */}
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              disabled={isLoading}
              className="p-3 bg-white hover:bg-[#D8F9B8]/20 border border-[#D8D5D1] hover:border-[#2B2D2D] rounded-xl transition-all text-left shadow-sm group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#2B2D2D] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Mode
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#D8F9B8] text-[#2B2D2D] font-bold">
                  Full CRUD
                </span>
              </div>
              <p className="text-[11px] text-[#666666]">
                Execute SQL DML, CRUD operations, & exam tools.
              </p>
            </button>

            {/* Quick Viewer Login */}
            <button
              type="button"
              onClick={() => handleQuickLogin('viewer')}
              disabled={isLoading}
              className="p-3 bg-white hover:bg-sky-50 border border-[#D8D5D1] hover:border-sky-400 rounded-xl transition-all text-left shadow-sm group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#2B2D2D] flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Viewer Mode
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">
                  Read-Only
                </span>
              </div>
              <p className="text-[11px] text-[#666666]">
                View bookings, SELECT queries, e-Tickets, & search.
              </p>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E6E6E6]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-[#8C8C8C] font-mono text-[10px]">Or Sign In With Enterprise Credentials</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Custom Login Form */}
        <form onSubmit={handleCustomLogin} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Portal ID */}
            <div>
              <label className="block text-xs font-bold text-[#2B2D2D] mb-1">
                Portal ID / Employee ID
              </label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 absolute left-3 top-3 text-[#8C8C8C]" />
                <input
                  type="text"
                  value={portalId}
                  onChange={(e) => setPortalId(e.target.value)}
                  placeholder="NLCI-7842"
                  className="w-full bg-[#F7F7F7] border border-[#D8D5D1] focus:border-[#2B2D2D] focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-[#2B2D2D] font-mono uppercase"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-[#2B2D2D] mb-1">
                Username / Email
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-3 text-[#8C8C8C]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="srivenkata"
                  className="w-full bg-[#F7F7F7] border border-[#D8D5D1] focus:border-[#2B2D2D] focus:bg-white rounded-xl pl-9 pr-3 py-2 text-xs text-[#2B2D2D]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-[#2B2D2D] mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-3.5 h-3.5 absolute left-3 top-3 text-[#8C8C8C]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F7F7F7] border border-[#D8D5D1] focus:border-[#2B2D2D] focus:bg-white rounded-xl pl-9 pr-10 py-2 text-xs text-[#2B2D2D]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#8C8C8C] hover:text-[#2B2D2D]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#2B2D2D] hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4 text-[#D8F9B8]" />
                <span>Authenticate & Choose Role</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="mt-6 pt-4 border-t border-[#E6E6E6] text-center text-[11px] text-[#666666] flex items-center justify-center gap-3">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2B2D2D]" />
            Encrypted ADO.NET Connection
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-[#2B2D2D]" />
            NLCIDB Ready
          </span>
        </div>
      </motion.div>
    </div>
  );
};
