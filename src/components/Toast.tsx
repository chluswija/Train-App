import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AdoNetLog } from '../types';
import { CheckCircle2, AlertCircle, Database, X, Sparkles } from 'lucide-react';

interface ToastProps {
  logs: AdoNetLog[];
  onDismiss: (id: string) => void;
}

interface ToastItemProps {
  log: AdoNetLog;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ log, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(log.id);
    }, 4500);

    return () => clearTimeout(timer);
  }, [log.id, onDismiss]);

  const isSuccess = log.status === 'SUCCESS';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85, y: -25, x: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: -20, x: 20 }}
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      className={`pointer-events-auto relative overflow-hidden rounded-2xl p-4 shadow-2xl border backdrop-blur-xl text-white w-full max-w-md transition-all ${
        isSuccess
          ? 'bg-[#2B2D2D]/95 border-[#D8F9B8]/40 shadow-black/40'
          : 'bg-rose-950/95 border-rose-500/50 shadow-rose-950/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-xl shrink-0 mt-0.5 ${
            isSuccess ? 'bg-[#D8F9B8] text-[#2B2D2D]' : 'bg-rose-500 text-white'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <AlertCircle className="w-4 h-4 stroke-[2.5]" />
          )}
        </div>

        <div className="flex-1 text-xs space-y-1.5 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-white flex items-center gap-1.5 truncate">
              <Database className="w-3.5 h-3.5 text-[#D8F9B8]" />
              <span>ADO.NET {log.action} Executed</span>
            </span>
            <span className="text-[10px] text-stone-400 font-mono shrink-0">
              {log.timestamp}
            </span>
          </div>

          <p className="text-stone-300 text-[11px] leading-snug">{log.details}</p>

          <div className="p-2 rounded-xl bg-black/50 border border-stone-700/60 font-mono text-[10px] text-[#D8F9B8] break-all max-h-16 overflow-y-auto scrollbar-none leading-relaxed">
            {log.sqlStatement}
          </div>

          {log.rowsAffected >= 0 && (
            <div className="flex items-center gap-2 pt-0.5">
              <span className="px-2 py-0.5 rounded-md bg-[#D8F9B8]/20 text-[#D8F9B8] text-[10px] font-mono font-bold border border-[#D8F9B8]/30">
                Rows Affected: {log.rowsAffected}
              </span>
              <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D8F9B8]" /> SqlCommand OK
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => onDismiss(log.id)}
          className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0"
          title="Dismiss Popup"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-vanishing progress countdown bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 4.5, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-1 ${
          isSuccess ? 'bg-[#D8F9B8]' : 'bg-rose-500'
        }`}
      />
    </motion.div>
  );
};

export const Toast: React.FC<ToastProps> = ({ logs, onDismiss }) => {
  if (logs.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-md w-[calc(100vw-2.5rem)] pointer-events-none">
      <AnimatePresence mode="popLayout">
        {logs.slice(-3).map((log) => (
          <ToastItem key={log.id} log={log} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

