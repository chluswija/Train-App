import React, { useState, useEffect } from 'react';
import { TrainBooking, UserProfile, SavedPassengerDetails } from '../types';
import {
  Train,
  User,
  Calendar,
  Clock,
  Phone,
  Ticket,
  Save,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Eye,
  Grid,
  BookmarkCheck,
  RotateCcw
} from 'lucide-react';
import { motion } from 'motion/react';

interface TrainQuestionnaireWizardProps {
  user: UserProfile;
  onSubmitAndLaunchScene: (booking: TrainBooking, shouldSaveDetails: boolean) => void;
  onOpenSeatMap: (currentSeat: string, onSelect: (seat: string) => void) => void;
  onSkipToDashboard?: () => void;
}

const PRESET_TRAINS = [
  'Vande Bharat Express (20901)',
  'Rajdhani Express (12951)',
  'Shatabdi Express (12002)',
  'Tejas Express (22671)',
  'Duronto Express (12259)',
  'Garib Rath Express (12216)',
  'Jan Shatabdi Express (12051)'
];

export const TrainQuestionnaireWizard: React.FC<TrainQuestionnaireWizardProps> = ({
  user,
  onSubmitAndLaunchScene,
  onOpenSeatMap,
  onSkipToDashboard
}) => {
  const SAVED_KEY = 'nlci_passenger_draft_memory';

  const [pnrno, setPnrno] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [seatNo, setSeatNo] = useState('S3-15');
  const [trainName, setTrainName] = useState(PRESET_TRAINS[0]);
  const [travelDate, setTravelDate] = useState('2026-08-15');
  const [time, setTime] = useState('06:30 AM');
  const [mobile, setMobile] = useState('+91 9876543210');
  
  const [rememberMe, setRememberMe] = useState(true);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const randomPnr = `PNR${Math.floor(10000000 + Math.random() * 90000000)}`;
    setPnrno(randomPnr);

    const saved = localStorage.getItem(SAVED_KEY);
    if (saved) {
      try {
        const parsed: SavedPassengerDetails = JSON.parse(saved);
        setHasSavedDraft(true);
        if (parsed.firstName) setFirstName(parsed.firstName);
        if (parsed.lastName) setLastName(parsed.lastName);
        if (parsed.seatNo) setSeatNo(parsed.seatNo);
        if (parsed.trainName) setTrainName(parsed.trainName);
        if (parsed.travelDate) setTravelDate(parsed.travelDate);
        if (parsed.time) setTime(parsed.time);
        if (parsed.mobile) setMobile(parsed.mobile);
        setRememberMe(parsed.rememberMe ?? true);
      } catch (e) {
        console.error('Failed to parse saved draft memory', e);
      }
    } else {
      setFirstName(user.employeeName.split(' ')[0] || 'Srivenkata');
      setLastName(user.employeeName.split(' ')[1] || 'Kishore');
    }
  }, [user]);

  useEffect(() => {
    if (rememberMe && (firstName || lastName || mobile)) {
      const draft: SavedPassengerDetails = {
        pnrno,
        firstName,
        lastName,
        seatNo,
        trainName,
        travelDate,
        time,
        mobile,
        rememberMe: true,
        lastUpdated: new Date().toLocaleTimeString()
      };
      localStorage.setItem(SAVED_KEY, JSON.stringify(draft));
      setHasSavedDraft(true);
    }
  }, [firstName, lastName, seatNo, trainName, travelDate, time, mobile, rememberMe, pnrno]);

  const handleClearSavedData = () => {
    localStorage.removeItem(SAVED_KEY);
    setHasSavedDraft(false);
    setFirstName('');
    setLastName('');
    setMobile('');
  };

  const handleGenerateNewPnr = () => {
    setPnrno(`PNR${Math.floor(10000000 + Math.random() * 90000000)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !seatNo.trim() || !mobile.trim()) {
      alert('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    const booking: TrainBooking = {
      pnrno: pnrno.trim().toUpperCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      seatNo: seatNo.trim(),
      trainName: trainName.trim(),
      travelDate: travelDate,
      time: time,
      mobile: mobile.trim(),
      status: 'Confirmed',
      amount: 1450,
      classType: 'CC',
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitAndLaunchScene(booking, rememberMe);
    }, 400);
  };

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-[85vh] bg-[#F3F2F1] text-[#2B2D2D] py-8 px-4 sm:px-6 flex flex-col items-center justify-center font-sans">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl bg-white border border-[#D8D5D1] rounded-3xl shadow-xl p-6 sm:p-10 relative"
      >
        {/* Top Header & Role Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E6E6E6] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#D8F9B8] text-[#2B2D2D] rounded-2xl flex items-center justify-center font-bold shadow-sm shrink-0">
              <Train className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-[#F7F7F7] rounded-full px-3 py-1 border border-[#E6E6E6] mb-1">
                <div className="w-2 h-2 rounded-full bg-[#2B2D2D] animate-pulse" />
                <span className="text-xs font-semibold text-[#2B2D2D]">Passenger Details Setup</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#2B2D2D] tracking-tight">
                Train Booking Questionnaire
              </h1>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border shrink-0 ${
            isAdmin
              ? 'bg-[#D8F9B8] text-[#2B2D2D] border-[#2B2D2D]/20'
              : 'bg-sky-100 text-sky-800 border-sky-300'
          }`}>
            {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-[#2B2D2D]" /> : <Eye className="w-3.5 h-3.5 text-sky-600" />}
            {user.role.toUpperCase()} MODE
          </span>
        </div>

        {/* Restore Saved Memory Notification Banner */}
        {hasSavedDraft && (
          <div className="mb-6 p-3.5 bg-[#D8F9B8]/30 border border-[#D8F9B8] rounded-2xl text-xs text-[#2B2D2D] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <BookmarkCheck className="w-4 h-4 text-[#2B2D2D] shrink-0" />
              <span>
                <strong>Saved Details Memory:</strong> Form fields restored from your previously saved entry.
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearSavedData}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline shrink-0"
            >
              Clear Memory
            </button>
          </div>
        )}

        {/* Main Questionnaire Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. PNR NO */}
            <div className="sm:col-span-2 bg-[#F7F7F7] p-4 rounded-2xl border border-[#E6E6E6]">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#2B2D2D] flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-[#2B2D2D]" />
                  1. PNR Number (Unique Identifier)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateNewPnr}
                  className="text-[11px] text-stone-700 hover:text-[#2B2D2D] font-mono font-bold flex items-center gap-1 underline"
                >
                  <RefreshCw className="w-3 h-3" /> Auto-Generate
                </button>
              </div>
              <input
                type="text"
                value={pnrno}
                onChange={(e) => setPnrno(e.target.value.toUpperCase())}
                placeholder="PNR88902143"
                className="w-full bg-white border border-[#D8D5D1] text-[#2B2D2D] font-mono font-bold text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2B2D2D]"
                required
              />
            </div>

            {/* 2. FIRST NAME */}
            <div>
              <label className="block text-xs font-semibold text-[#2B2D2D] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-600" />
                2. Passenger First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Srivenkata"
                className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] text-xs font-medium rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2B2D2D] focus:bg-white"
                required
              />
            </div>

            {/* 3. LAST NAME */}
            <div>
              <label className="block text-xs font-semibold text-[#2B2D2D] mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-600" />
                3. Passenger Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Kishore"
                className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] text-xs font-medium rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2B2D2D] focus:bg-white"
                required
              />
            </div>

            {/* 4. SEAT NO */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#2B2D2D] flex items-center gap-1.5">
                  <Grid className="w-3.5 h-3.5 text-stone-600" />
                  4. Seat Number
                </label>
                <button
                  type="button"
                  onClick={() => onOpenSeatMap(seatNo, (selected) => setSeatNo(selected))}
                  className="text-[10px] text-[#2B2D2D] font-bold underline"
                >
                  Pick Seat Map
                </button>
              </div>
              <input
                type="text"
                value={seatNo}
                onChange={(e) => setSeatNo(e.target.value)}
                placeholder="S3-15"
                className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] font-mono font-bold text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2B2D2D] focus:bg-white"
                required
              />
            </div>

            {/* 5. TRAIN NAME */}
            <div>
              <label className="block text-xs font-semibold text-[#2B2D2D] mb-1.5 flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-stone-600" />
                5. Select Express Train
              </label>
              <select
                value={trainName}
                onChange={(e) => setTrainName(e.target.value)}
                className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] text-xs font-medium rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2B2D2D] focus:bg-white"
              >
                {PRESET_TRAINS.map((train, idx) => (
                  <option key={idx} value={train}>{train}</option>
                ))}
              </select>
            </div>

            {/* 6. TRAVEL DATE */}
            <div>
              <label className="block text-xs font-semibold text-[#2B2D2D] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-600" />
                6. Travel Date
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] font-mono text-xs font-medium rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2B2D2D] focus:bg-white"
                required
              />
            </div>

            {/* 7. TIME */}
            <div>
              <label className="block text-xs font-semibold text-[#2B2D2D] mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-600" />
                7. Scheduled Time
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] font-mono text-xs font-medium rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2B2D2D] focus:bg-white"
              >
                <option value="06:00 AM">06:00 AM</option>
                <option value="06:30 AM">06:30 AM</option>
                <option value="08:15 AM">08:15 AM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="05:45 PM">05:45 PM</option>
                <option value="10:00 PM">10:00 PM</option>
              </select>
            </div>

            {/* 8. MOBILE NO */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#2B2D2D] mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-600" />
                8. Contact Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] font-mono text-xs font-medium rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2B2D2D] focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Save & Remember Option */}
          <div className="p-4 bg-[#F7F7F7] border border-[#E6E6E6] rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#D8F9B8] text-[#2B2D2D] rounded-xl font-bold">
                <Save className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#2B2D2D] block">
                  Remember & Save Passenger Details
                </span>
                <span className="text-[11px] text-[#666666]">
                  Store details in browser memory to auto-fill future train bookings.
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2B2D2D]"></div>
            </label>
          </div>

          {/* Submit Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E6E6E6]">
            {onSkipToDashboard && (
              <button
                type="button"
                onClick={onSkipToDashboard}
                className="text-xs text-[#666666] hover:text-[#2B2D2D] underline font-medium"
              >
                Skip & View All Bookings
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#2B2D2D] hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D8F9B8]" />
                  <span>Launch Main Scene for {trainName.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
