import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, CheckCheck } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const configs = {
    PENDING: {
      label: 'Pending Approval',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock
    },
    CONFIRMED: {
      label: 'Confirmed',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: CheckCircle2
    },
    COMPLETED: {
      label: 'Completed',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCheck
    },
    CANCELLED: {
      label: 'Cancelled',
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: XCircle
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: AlertCircle
    },
    ACTIVE: {
      label: 'Active Fleet',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2
    },
    INACTIVE: {
      label: 'Deactivated',
      bg: 'bg-slate-100 text-slate-500 border-slate-200',
      icon: XCircle
    }
  };

  const current = configs[status] || {
    label: status,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: AlertCircle
  };

  const IconComponent = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg}`}
    >
      <IconComponent className="w-3.5 h-3.5" />
      {current.label}
    </span>
  );
};

export default StatusBadge;
