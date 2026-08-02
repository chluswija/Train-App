import React, { useState, useRef, useEffect } from 'react';
import { TrainBooking, UserProfile } from '../types';
import {
  Train,
  Ticket,
  User,
  Calendar,
  Clock,
  Phone,
  Grid,
  CheckCircle2,
  ShieldCheck,
  Eye,
  MapPin,
  Edit2,
  Database,
  ArrowRight,
  Lock,
  RotateCcw,
  Compass,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface TrainMainSceneDashboardProps {
  booking: TrainBooking;
  user: UserProfile;
  onEditBooking: (booking: TrainBooking) => void;
  onDeleteBooking: (pnrno: string) => void;
  onOpenSeatMap: (seat: string, onSelect: (seat: string) => void) => void;
  onOpenTicketReceipt: (booking: TrainBooking) => void;
  onEnterNewTrainDetails: () => void;
  onGoToFullTable: () => void;
}

export const TrainMainSceneDashboard: React.FC<TrainMainSceneDashboardProps> = ({
  booking,
  user,
  onEditBooking,
  onDeleteBooking,
  onOpenSeatMap,
  onOpenTicketReceipt,
  onEnterNewTrainDetails,
  onGoToFullTable
}) => {
  const [activeViewTab, setActiveViewTab] = useState<'overview' | 'coach' | 'route'>('overview');
  const isAdmin = user.role === 'admin';

  const sceneTabRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (sceneTabRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sceneTabRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = sceneTabRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const handleScroll = (dir: 'left' | 'right') => {
    if (sceneTabRef.current) {
      sceneTabRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  const stops = [
    { name: 'Origin Terminal Station', time: booking.time, status: 'Departed' },
    { name: 'Junction Halt 1', time: '08:45 AM', status: 'On-Time' },
    { name: 'Junction Halt 2', time: '11:20 AM', status: 'Scheduled' },
    { name: 'Destination City Central', time: '02:15 PM', status: 'Scheduled' }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Main Scene Banner - Fully Theme Responsive */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 theme-card rounded-3xl shadow-xl relative overflow-hidden border border-theme"
      >
        <div className="relative z-10 space-y-6">
          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-theme">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-accent text-accent-foreground font-mono text-xs font-bold rounded-full shadow-sm">
                ACTIVE TRAIN SCENE
              </span>
              <span className="opacity-40">•</span>
              <span className="text-xs font-mono opacity-90">
                PNR: <strong className="text-accent">{booking.pnrno}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                isAdmin ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              }`}>
                {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-accent" /> : <Eye className="w-3.5 h-3.5 text-sky-400" />}
                {isAdmin ? 'Admin Management' : 'Viewer (Read-Only)'}
              </span>

              <button
                onClick={onEnterNewTrainDetails}
                className="px-3 py-1 text-xs font-semibold theme-subcard hover:opacity-90 rounded-xl border border-theme transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-accent" />
                <span>Change Passenger Details</span>
              </button>
            </div>
          </div>

          {/* Title & Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-accent text-accent-foreground rounded-2xl flex items-center justify-center font-bold shadow-md shrink-0">
                  <Train className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs text-accent font-mono font-bold tracking-wider uppercase block">
                    Express Railway Line Scene
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {booking.trainName}
                  </h1>
                </div>
              </div>

              <p className="text-xs opacity-80 flex flex-wrap items-center gap-3 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  Travel Date: <strong className="font-mono opacity-100">{booking.travelDate}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  Time: <strong className="font-mono opacity-100">{booking.time}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Grid className="w-3.5 h-3.5 text-accent" />
                  Seat Reserved: <strong className="text-accent font-mono">{booking.seatNo}</strong>
                </span>
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onOpenTicketReceipt(booking)}
                className="px-4 py-2.5 bg-accent hover:opacity-90 text-accent-foreground font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>View & Print e-Ticket</span>
              </button>

              {isAdmin ? (
                <button
                  onClick={() => onEditBooking(booking)}
                  className="px-4 py-2.5 theme-subcard hover:opacity-90 font-semibold text-xs rounded-xl border border-theme transition-all flex items-center gap-1.5"
                >
                  <Edit2 className="w-4 h-4 text-accent" />
                  <span>Edit Details</span>
                </button>
              ) : (
                <div className="px-3 py-2 theme-subcard opacity-70 text-xs font-mono rounded-xl border border-theme flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Read-Only</span>
                </div>
              )}
            </div>
          </div>

          {/* Passenger Details Quick Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 theme-subcard rounded-2xl border border-theme">
              <span className="text-[11px] opacity-70 font-medium block">Passenger Name</span>
              <span className="text-sm font-bold mt-1 block flex items-center gap-2">
                <User className="w-4 h-4 text-accent shrink-0" />
                {booking.firstName} {booking.lastName}
              </span>
            </div>

            <div className="p-4 theme-subcard rounded-2xl border border-theme">
              <span className="text-[11px] opacity-70 font-medium block">Assigned Seat</span>
              <span className="text-sm font-bold text-accent font-mono mt-1 block flex items-center gap-2">
                <Grid className="w-4 h-4 text-accent shrink-0" />
                {booking.seatNo}
              </span>
            </div>

            <div className="p-4 theme-subcard rounded-2xl border border-theme">
              <span className="text-[11px] opacity-70 font-medium block">Contact Mobile</span>
              <span className="text-sm font-bold font-mono mt-1 block flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                {booking.mobile}
              </span>
            </div>

            <div className="p-4 theme-subcard rounded-2xl border border-theme">
              <span className="text-[11px] opacity-70 font-medium block">Status & Fare</span>
              <span className="text-sm font-bold text-accent mt-1 block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                {booking.status} • ₹{booking.amount || 1450}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Scene Tab Navigation */}
      <div className="relative flex items-center w-full border-b border-theme pb-2">
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 z-10 p-1.5 theme-card text-accent rounded-xl shadow-md transition-all"
            aria-label="Slide Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        <div
          ref={sceneTabRef}
          className="flex items-center gap-2 overflow-x-auto scroll-smooth touch-pan-x select-none scrollbar-none w-full"
        >
          <button
            onClick={() => setActiveViewTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeViewTab === 'overview'
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'theme-card hover:opacity-90 border border-theme'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Train Scene Overview</span>
          </button>

          <button
            onClick={() => setActiveViewTab('coach')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeViewTab === 'coach'
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'theme-card hover:opacity-90 border border-theme'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Coach Seat Layout ({booking.seatNo})</span>
          </button>

          <button
            onClick={() => setActiveViewTab('route')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeViewTab === 'route'
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'theme-card hover:opacity-90 border border-theme'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Live Route Timeline</span>
          </button>

          <button
            onClick={onGoToFullTable}
            className="ml-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-accent text-accent-foreground hover:opacity-90 border border-theme flex items-center gap-2 whitespace-nowrap transition-all shrink-0"
          >
            <Database className="w-4 h-4" />
            <span>All Database Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 z-10 p-1.5 theme-card text-accent rounded-xl shadow-md transition-all"
            aria-label="Slide Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tab 1: Train Scene Overview */}
      {activeViewTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="theme-card border border-theme rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-theme">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-accent" />
                  ADO.NET Database Pipeline & Active SQL
                </h3>
                <span className="text-[10px] font-mono theme-subcard px-2.5 py-1 rounded-lg border border-theme">
                  dbo.Trainbooking
                </span>
              </div>

              <div className="p-4 theme-subcard text-accent rounded-2xl font-mono text-xs space-y-2 border border-theme">
                <span className="opacity-60 text-[10px] block">// Executed SQL Query for current scene</span>
                <p className="font-mono">
                  SELECT Pnrno, FirstName, LastName, SeatNo, TrainName, TravelDate, [Time], Mobile<br />
                  FROM dbo.Trainbooking<br />
                  WHERE Pnrno = '{booking.pnrno}';
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 theme-subcard rounded-xl border border-theme">
                  <span className="text-[10px] opacity-60 block">Primary Key (PNR)</span>
                  <span className="font-bold text-accent">{booking.pnrno}</span>
                </div>
                <div className="p-3 theme-subcard rounded-xl border border-theme">
                  <span className="text-[10px] opacity-60 block">System.Data.SqlClient</span>
                  <span className="font-bold">Connected</span>
                </div>
                <div className="p-3 theme-subcard rounded-xl border border-theme">
                  <span className="text-[10px] opacity-60 block">Permissions</span>
                  <span className="font-bold">
                    {isAdmin ? 'FULL CRUD' : 'READ-ONLY'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="theme-card border border-theme rounded-3xl p-6 shadow-md space-y-4">
              <h3 className="font-bold text-sm flex items-center gap-2 pb-3 border-b border-theme">
                <User className="w-4 h-4 text-accent" />
                Passenger Manifest Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-theme">
                  <span className="opacity-70">First Name:</span>
                  <span className="font-bold">{booking.firstName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-theme">
                  <span className="opacity-70">Last Name:</span>
                  <span className="font-bold">{booking.lastName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-theme">
                  <span className="opacity-70">Seat Number:</span>
                  <span className="font-mono font-bold text-accent">{booking.seatNo}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-theme">
                  <span className="opacity-70">Travel Date:</span>
                  <span className="font-mono">{booking.travelDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-theme">
                  <span className="opacity-70">Scheduled Time:</span>
                  <span className="font-mono">{booking.time}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="opacity-70">Mobile Contact:</span>
                  <span className="font-mono">{booking.mobile}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Coach Seat Layout */}
      {activeViewTab === 'coach' && (
        <div className="theme-card border border-theme rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-theme">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Grid className="w-4 h-4 text-accent" />
                Coach Seat Visualizer: {booking.trainName}
              </h3>
              <p className="text-xs opacity-70">
                Assigned seat <strong className="text-accent font-mono">{booking.seatNo}</strong> is reserved.
              </p>
            </div>

            <button
              onClick={() => onOpenSeatMap(booking.seatNo, () => {})}
              className="px-3.5 py-2 bg-accent text-accent-foreground font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Interactive Seat Map</span>
            </button>
          </div>

          <div className="p-6 theme-subcard rounded-2xl border border-theme text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-2xl font-mono text-xs font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
              SEAT {booking.seatNo} ASSIGNED TO {booking.firstName.toUpperCase()} {booking.lastName.toUpperCase()}
            </div>
            <p className="text-xs opacity-70 max-w-md mx-auto">
              Chair Car Coach layout loaded. Confirmed for travel on {booking.travelDate}.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Route Timeline */}
      {activeViewTab === 'route' && (
        <div className="theme-card border border-theme rounded-3xl p-6 shadow-md space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-2 pb-3 border-b border-theme">
            <MapPin className="w-4 h-4 text-accent" />
            Express Route Timeline & Junction Halts
          </h3>

          <div className="space-y-3 pt-2">
            {stops.map((stop, idx) => (
              <div key={idx} className="flex items-start gap-4 text-xs relative">
                <div className="w-3 h-3 rounded-full bg-accent shrink-0 mt-1" />
                <div className="flex-1 theme-subcard p-3.5 rounded-2xl border border-theme flex items-center justify-between">
                  <div>
                    <span className="font-bold block">{stop.name}</span>
                    <span className="text-[11px] opacity-70 font-mono">Scheduled: {stop.time}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-accent text-accent-foreground font-bold">
                    {stop.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
