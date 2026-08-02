import React, { useState } from 'react';
import { TrainBooking, SqlQueryResult, UserRole } from '../types';
import {
  Database,
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Clock,
  Layers,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface SqlConsoleProps {
  bookings: TrainBooking[];
  userRole?: UserRole;
  onExecuteQuery: (sql: string) => SqlQueryResult;
}

export const SqlConsole: React.FC<SqlConsoleProps> = ({
  bookings,
  userRole = 'admin',
  onExecuteQuery
}) => {
  const [query, setQuery] = useState('SELECT * FROM dbo.Trainbooking ORDER BY TravelDate DESC;');
  const [lastResult, setLastResult] = useState<SqlQueryResult | null>(null);

  const isViewer = userRole === 'viewer';

  const sampleQueries = [
    {
      title: 'SELECT All Bookings',
      sql: 'SELECT * FROM dbo.Trainbooking ORDER BY TravelDate DESC;'
    },
    {
      title: 'SELECT Vande Bharat',
      sql: "SELECT * FROM dbo.Trainbooking WHERE TrainName LIKE '%Vande Bharat%';"
    },
    {
      title: 'INSERT Booking',
      sql: "INSERT INTO dbo.Trainbooking (Pnrno, FirstName, LastName, SeatNo, TrainName, TravelDate, [Time], Mobile)\nVALUES ('PNR99887766', 'Karthik', 'Raja', 'B3-18', 'Vande Bharat Express (20901)', '2026-08-25', '06:00 AM', '9876501234');"
    },
    {
      title: 'UPDATE Seat',
      sql: "UPDATE dbo.Trainbooking\nSET SeatNo = 'A1-01', [Time] = '09:30 AM'\nWHERE Pnrno = 'PNR84920156';"
    },
    {
      title: 'DELETE Booking',
      sql: "DELETE FROM dbo.Trainbooking WHERE Pnrno = 'PNR52617283';"
    }
  ];

  const handleRun = () => {
    if (!query.trim()) return;

    if (isViewer) {
      const upper = query.trim().toUpperCase();
      if (!upper.startsWith('SELECT')) {
        setLastResult({
          success: false,
          message: 'Access Denied: Viewer role is restricted to SELECT queries only. DML modifications require Admin access.',
          rowsAffected: 0,
          executionTimeMs: 0
        });
        return;
      }
    }

    const res = onExecuteQuery(query);
    setLastResult(res);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="p-6 bg-[#2B2D2D] text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D8F9B8] text-[#2B2D2D] rounded-xl flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              SQL Console & ADO.NET Engine
              <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-full ${
                isViewer ? 'bg-sky-500/20 text-sky-300' : 'bg-[#D8F9B8]/20 text-[#D8F9B8]'
              }`}>
                {isViewer ? 'Viewer Mode (SELECT Only)' : 'Admin Mode'}
              </span>
            </h2>
          </div>
          <p className="text-xs text-stone-300 max-w-2xl pt-1">
            Execute SQL queries against <code className="text-[#D8F9B8] font-mono">dbo.Trainbooking</code> table.
            Simulates ADO.NET Pipeline: <code className="text-stone-300 font-mono">SqlConnection → SqlCommand → SqlDataReader</code>.
          </p>
        </div>

        <button
          onClick={handleRun}
          className="px-5 py-2.5 bg-[#D8F9B8] hover:bg-[#cbf7a3] text-[#2B2D2D] text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2"
        >
          <Play className="w-4 h-4 fill-current text-[#2B2D2D]" />
          <span>Execute Query (ADO.NET)</span>
        </button>
      </div>

      {/* Preset Queries */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-[#666666] font-bold shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#2B2D2D]" /> Sample Queries:
        </span>
        {sampleQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => setQuery(q.sql)}
            className="px-3.5 py-1.5 bg-white hover:bg-[#F7F7F7] text-[#2B2D2D] text-xs font-mono rounded-xl border border-[#D8D5D1] transition-colors whitespace-nowrap font-medium"
          >
            {q.title}
          </button>
        ))}
      </div>

      {/* Editor & Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#2B2D2D] text-white border border-stone-700 rounded-3xl p-4 shadow-xl flex flex-col h-80">
            <div className="flex items-center justify-between pb-3 border-b border-stone-700 text-xs text-stone-300 font-mono">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#D8F9B8]" /> SQL Editor
              </span>
              <span>Target: dbo.Trainbooking</span>
            </div>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter SQL query..."
              className="w-full flex-1 bg-transparent text-[#D8F9B8] font-mono text-xs p-3 focus:outline-none resize-none leading-relaxed"
            />

            <div className="pt-3 border-t border-stone-700 flex items-center justify-between">
              <span className="text-[10px] text-stone-400 font-mono">
                {isViewer ? 'Viewer Mode: SELECT queries allowed' : 'Admin Mode: SELECT, INSERT, UPDATE, DELETE permitted'}
              </span>
              <button
                onClick={() => setQuery('')}
                className="text-xs text-stone-300 hover:text-white flex items-center gap-1 font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>

          {/* Execution Result */}
          {lastResult && (
            <div
              className={`p-4 rounded-2xl border text-xs ${
                lastResult.success
                  ? 'bg-white border-[#D8D5D1] text-[#2B2D2D]'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold flex items-center gap-1.5">
                  {lastResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-[#2B2D2D]" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  {lastResult.message}
                </span>
                <span className="text-[10px] font-mono text-[#666666] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Time: {lastResult.executionTimeMs}ms
                </span>
              </div>

              {lastResult.rowsAffected >= 0 && (
                <div className="font-mono text-[#666666]">
                  Rows Affected: <strong className="text-[#2B2D2D]">{lastResult.rowsAffected}</strong>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Diagnostics Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-[#D8D5D1] rounded-3xl p-5 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-[#2B2D2D] uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2B2D2D]" />
              <span>Pipeline Monitor</span>
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#F7F7F7] border border-[#E6E6E6] flex items-center justify-between">
                <span className="text-[#666666]">Connection:</span>
                <span className="text-[#2B2D2D] font-bold">Open</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F7F7F7] border border-[#E6E6E6] flex items-center justify-between">
                <span className="text-[#666666]">Active Role:</span>
                <span className="text-[#2B2D2D] font-bold">
                  {userRole.toUpperCase()}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F7F7F7] border border-[#E6E6E6] flex items-center justify-between">
                <span className="text-[#666666]">Write Privileges:</span>
                <span className={isViewer ? 'text-rose-600 font-bold' : 'text-[#2B2D2D] font-bold'}>
                  {isViewer ? 'DISABLED' : 'GRANTED'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F7F7F7] border border-[#E6E6E6] flex items-center justify-between">
                <span className="text-[#666666]">Table Records:</span>
                <span className="text-[#2B2D2D] font-bold">{bookings.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Query Result Table */}
      {lastResult?.data && (
        <div className="bg-white border border-[#D8D5D1] rounded-3xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-[#E6E6E6] bg-[#F7F7F7] flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#2B2D2D] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#2B2D2D]" />
              <span>Query Results ({lastResult.data.length} records)</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F7F7F7] border-b border-[#E6E6E6] text-[#666666] font-mono">
                  <th className="py-3 px-4">Pnrno</th>
                  <th className="py-3 px-4">FirstName</th>
                  <th className="py-3 px-4">LastName</th>
                  <th className="py-3 px-4">SeatNo</th>
                  <th className="py-3 px-4">TrainName</th>
                  <th className="py-3 px-4">TravelDate</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Mobile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E6E6] font-mono">
                {lastResult.data.map((row) => (
                  <tr key={row.pnrno} className="hover:bg-[#F7F7F7]">
                    <td className="py-2.5 px-4 font-bold text-[#2B2D2D]">{row.pnrno}</td>
                    <td className="py-2.5 px-4">{row.firstName}</td>
                    <td className="py-2.5 px-4">{row.lastName}</td>
                    <td className="py-2.5 px-4 font-bold text-[#2B2D2D]">{row.seatNo}</td>
                    <td className="py-2.5 px-4">{row.trainName}</td>
                    <td className="py-2.5 px-4 text-[#666666]">{row.travelDate}</td>
                    <td className="py-2.5 px-4 text-[#666666]">{row.time}</td>
                    <td className="py-2.5 px-4 text-[#666666]">{row.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
