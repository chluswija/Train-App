import React, { useState } from 'react';
import { TrainBooking, UserRole } from '../types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Ticket,
  Train,
  Calendar,
  Phone,
  CheckCircle2,
  Clock,
  Database,
  ArrowUpDown,
  Download,
  AlertTriangle,
  Lock,
  Eye
} from 'lucide-react';

interface BookingListProps {
  bookings: TrainBooking[];
  userRole?: UserRole;
  onNewBooking: () => void;
  onEditBooking: (booking: TrainBooking) => void;
  onDeleteBooking: (pnrno: string) => void;
  onViewTicket: (booking: TrainBooking) => void;
  onExportCsv: () => void;
}

export const BookingList: React.FC<BookingListProps> = ({
  bookings,
  userRole = 'admin',
  onNewBooking,
  onEditBooking,
  onDeleteBooking,
  onViewTicket,
  onExportCsv
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'travelDate' | 'pnrno' | 'name'>('travelDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteConfirmPnr, setDeleteConfirmPnr] = useState<string | null>(null);

  const isViewer = userRole === 'viewer';

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.pnrno.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.trainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.mobile.includes(searchQuery) ||
      b.seatNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === 'ALL' || b.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    let comp = 0;
    if (sortBy === 'travelDate') {
      comp = a.travelDate.localeCompare(b.travelDate);
    } else if (sortBy === 'pnrno') {
      comp = a.pnrno.localeCompare(b.pnrno);
    } else if (sortBy === 'name') {
      comp = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    }
    return sortOrder === 'asc' ? comp : -comp;
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 1450), 0);
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Viewer Read-Only Banner */}
      {isViewer && (
        <div className="p-4 bg-sky-500/15 border border-sky-500/30 rounded-2xl text-xs text-sky-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Passenger View:</strong> Displaying e-Tickets for your account. Database operations are restricted to Admins.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            PASSENGER TICKET
          </span>
        </div>
      )}

      {/* Metric Cards - Theme Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 theme-card border border-theme rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs opacity-70 font-medium block">Total Bookings</span>
            <span className="text-2xl font-extrabold font-mono mt-1 block">
              {bookings.length}
            </span>
          </div>
          <div className="p-3 bg-accent text-accent-foreground rounded-xl font-bold">
            <Train className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 theme-card border border-theme rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs opacity-70 font-medium block">Confirmed Tickets</span>
            <span className="text-2xl font-extrabold font-mono mt-1 block">
              {confirmedCount}
            </span>
          </div>
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl font-bold border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 theme-card border border-theme rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs opacity-70 font-medium block">Total Fare Value</span>
            <span className="text-2xl font-extrabold font-mono mt-1 block">
              ₹{totalRevenue.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-accent text-accent-foreground rounded-xl font-bold">
            <Ticket className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 theme-card border border-theme rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs opacity-70 font-medium block">Active Table</span>
            <span className="text-sm font-bold font-mono text-accent mt-1 block">
              dbo.Trainbooking
            </span>
          </div>
          <div className="p-3 theme-subcard rounded-xl font-bold border border-theme">
            <Database className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="theme-card border border-theme rounded-3xl shadow-lg overflow-hidden">
        {/* Controls */}
        <div className="p-4 sm:p-5 border-b border-theme theme-subcard flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 opacity-50 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PNR, Name, Train, Mobile, Seat..."
                className="w-full theme-card border border-theme text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-accent"
              />
            </div>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="theme-card border border-theme text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-accent"
            >
              <option value="ALL">All Ticket Statuses</option>
              <option value="Confirmed">Confirmed Only</option>
              <option value="RAC">RAC Only</option>
              <option value="Waitlisted">Waitlisted</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportCsv}
              className="px-3.5 py-2.5 theme-card border border-theme hover:opacity-90 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-accent" />
              <span>Export CSV</span>
            </button>

            {!isViewer ? (
              <button
                onClick={onNewBooking}
                className="px-4 py-2.5 bg-accent hover:opacity-90 text-accent-foreground text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Train Booking</span>
              </button>
            ) : (
              <button
                disabled
                className="px-4 py-2.5 theme-subcard opacity-50 text-xs font-bold rounded-xl cursor-not-allowed flex items-center gap-2 border border-theme"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>New Booking (Admin)</span>
              </button>
            )}
          </div>
        </div>

        {/* Data Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="theme-subcard border-b border-theme text-[11px] font-bold uppercase tracking-wider opacity-80">
                <th className="py-3.5 px-4 font-mono">
                  <button
                    onClick={() => {
                      setSortBy('pnrno');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                    className="flex items-center gap-1 hover:text-accent"
                  >
                    <span>PNR No</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4">
                  <button
                    onClick={() => {
                      setSortBy('name');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                    className="flex items-center gap-1 hover:text-accent"
                  >
                    <span>Passenger Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4">Seat No</th>
                <th className="py-3.5 px-4">Train Name</th>
                <th className="py-3.5 px-4">Travel Date</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme text-xs">
              {sortedBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center opacity-60">
                    No train bookings matching your search query.
                  </td>
                </tr>
              ) : (
                sortedBookings.map((b) => (
                  <tr key={b.pnrno} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">
                      {b.pnrno}
                    </td>

                    <td className="py-3.5 px-4 font-bold">
                      {b.firstName} {b.lastName}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-accent text-accent-foreground font-bold">
                        {b.seatNo}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {b.trainName}
                    </td>

                    <td className="py-3.5 px-4 font-mono opacity-80">
                      {b.travelDate}
                    </td>

                    <td className="py-3.5 px-4 font-mono opacity-80">
                      {b.time}
                    </td>

                    <td className="py-3.5 px-4 font-mono opacity-80">
                      {b.mobile}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent text-accent-foreground">
                        {b.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewTicket(b)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-accent text-accent-foreground hover:opacity-90 rounded-lg transition-all flex items-center gap-1 border border-theme"
                          title="e-Ticket Receipt"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>e-Ticket</span>
                        </button>

                        {!isViewer ? (
                          <>
                            <button
                              onClick={() => onEditBooking(b)}
                              className="p-1.5 opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-accent" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmPnr(b.pnrno)}
                              className="p-1.5 text-rose-500 hover:bg-rose-500/20 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] font-mono opacity-60 px-2 py-0.5 theme-subcard rounded border border-theme">
                            Read-Only
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmPnr && !isViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="theme-card border border-theme rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base">Delete Train Booking</h3>
                <p className="text-xs opacity-70">PNR: <strong className="font-mono text-accent">{deleteConfirmPnr}</strong></p>
              </div>
            </div>

            <p className="text-xs opacity-80">
              This will remove the record from <code className="font-mono text-accent">dbo.Trainbooking</code>.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmPnr(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold opacity-70 hover:opacity-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteBooking(deleteConfirmPnr);
                  setDeleteConfirmPnr(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
