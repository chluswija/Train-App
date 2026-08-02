import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import {
  ShieldCheck,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowRight,
  User,
  Building2,
  Sparkles,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';

interface RoleSelectionPageProps {
  user: UserProfile;
  onConfirmRole: (selectedRole: UserRole) => void;
  onBackToLogin: () => void;
}

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({
  user,
  onConfirmRole,
  onBackToLogin
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role || 'admin');

  return (
    <div className="min-h-screen bg-[#F3F2F1] text-[#2B2D2D] flex flex-col justify-center items-center px-4 py-10 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl bg-white border border-[#D8D5D1] rounded-3xl shadow-xl p-6 sm:p-10 relative z-10"
      >
        {/* User Identity Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E6E6E6] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#D8F9B8] text-[#2B2D2D] flex items-center justify-center font-bold text-lg shadow-sm border border-[#2B2D2D]/10">
              {user.employeeName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#2B2D2D]">{user.employeeName}</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#F7F7F7] text-[#2B2D2D] rounded border border-[#E6E6E6]">
                  {user.portalId}
                </span>
              </div>
              <p className="text-xs text-[#666666] mt-0.5 flex items-center gap-2">
                <span>{user.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#2B2D2D]" />
                  {user.department}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onBackToLogin}
            className="text-xs font-semibold text-[#666666] hover:text-[#2B2D2D] underline underline-offset-4 self-start sm:self-auto"
          >
            Switch Account
          </button>
        </div>

        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#F7F7F7] rounded-full px-3 py-1 border border-[#E6E6E6] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2B2D2D]" />
            <span className="text-xs font-semibold text-[#2B2D2D]">Role Access Selection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2D2D] tracking-tight">
            Choose Operating Interface Role
          </h1>
          <p className="text-xs text-[#666666] mt-1 max-w-xl mx-auto">
            Permissions and available action controls will adapt dynamically.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Admin Role Card */}
          <div
            onClick={() => setSelectedRole('admin')}
            className={`cursor-pointer rounded-2xl p-6 transition-all relative border ${
              selectedRole === 'admin'
                ? 'bg-white border-[#2B2D2D] shadow-lg ring-2 ring-[#2B2D2D]'
                : 'bg-[#F7F7F7] hover:bg-white border-[#E6E6E6]'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#D8F9B8] text-[#2B2D2D] rounded-xl font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              {selectedRole === 'admin' ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D8F9B8] text-[#2B2D2D] border border-[#2B2D2D]/20">
                  SELECTED
                </span>
              ) : (
                <span className="text-xs font-mono text-[#8C8C8C]">Click to Select</span>
              )}
            </div>

            <h3 className="text-lg font-bold text-[#2B2D2D] mb-1 flex items-center gap-2">
              Administrator Role
              <span className="px-2 py-0.5 text-[10px] font-mono bg-[#D8F9B8] text-[#2B2D2D] rounded font-bold">
                Full CRUD
              </span>
            </h3>
            <p className="text-xs text-[#666666] mb-4">
              Complete administrative authority to manage train bookings, execute SQL DML, and package solution ZIPs.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#2B2D2D]">
                <CheckCircle2 className="w-4 h-4 text-[#2B2D2D] shrink-0" />
                <span>Full CRUD Access: Add, Edit, & Delete Bookings</span>
              </div>
              <div className="flex items-center gap-2 text-[#2B2D2D]">
                <CheckCircle2 className="w-4 h-4 text-[#2B2D2D] shrink-0" />
                <span>Execute Raw SQL DML (INSERT, UPDATE, DELETE)</span>
              </div>
              <div className="flex items-center gap-2 text-[#2B2D2D]">
                <CheckCircle2 className="w-4 h-4 text-[#2B2D2D] shrink-0" />
                <span>Interactive Seat Map & Solution Package Controls</span>
              </div>
            </div>
          </div>

          {/* Viewer Role Card */}
          <div
            onClick={() => setSelectedRole('viewer')}
            className={`cursor-pointer rounded-2xl p-6 transition-all relative border ${
              selectedRole === 'viewer'
                ? 'bg-white border-sky-600 shadow-lg ring-2 ring-sky-600'
                : 'bg-[#F7F7F7] hover:bg-white border-[#E6E6E6]'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-sky-100 text-sky-800 rounded-xl font-bold">
                <Eye className="w-6 h-6" />
              </div>
              {selectedRole === 'viewer' ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
                  SELECTED
                </span>
              ) : (
                <span className="text-xs font-mono text-[#8C8C8C]">Click to Select</span>
              )}
            </div>

            <h3 className="text-lg font-bold text-[#2B2D2D] mb-1 flex items-center gap-2">
              Viewer Role
              <span className="px-2 py-0.5 text-[10px] font-mono bg-sky-100 text-sky-800 rounded font-bold">
                Read-Only
              </span>
            </h3>
            <p className="text-xs text-[#666666] mb-4">
              Specifically tailored for auditors and viewers with strict read-only data access.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#2B2D2D]">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Read-Only Booking Access (Search & Filter)</span>
              </div>
              <div className="flex items-center gap-2 text-[#2B2D2D]">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Print Official e-Tickets & Export CSV</span>
              </div>
              <div className="flex items-center gap-2 text-rose-600">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>No Write/Edit/Delete Permissions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E6E6E6]">
          <div className="text-xs text-[#666666] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#2B2D2D]" />
            <span>Role permissions automatically configured.</span>
          </div>

          <button
            onClick={() => onConfirmRole(selectedRole)}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#2B2D2D] hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed with {selectedRole === 'admin' ? 'Admin Role' : 'Viewer Role'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
