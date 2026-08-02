import React, { useState, useEffect } from 'react';
import { TrainBooking } from '../types';
import { AVAILABLE_TRAINS } from '../data/initialData';
import {
  Train,
  User,
  Calendar,
  Clock,
  Phone,
  Grid,
  Sparkles,
  Save,
  AlertCircle,
  X
} from 'lucide-react';

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: Omit<TrainBooking, 'createdAt'>) => void;
  initialData?: TrainBooking | null;
  onOpenSeatMap: (currentSeat: string, onSelect: (seat: string) => void) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  onOpenSeatMap
}) => {
  const isEditing = Boolean(initialData);

  const generatePnr = () => {
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    return `PNR${randomDigits}`;
  };

  const [pnrno, setPnrno] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [seatNo, setSeatNo] = useState('');
  const [trainName, setTrainName] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [time, setTime] = useState('08:30 AM');
  const [mobile, setMobile] = useState('');
  const [classType, setClassType] = useState<'1A' | '2A' | '3A' | 'SL' | 'CC' | 'EC'>('CC');
  const [amount, setAmount] = useState(1450);
  const [status, setStatus] = useState<'Confirmed' | 'RAC' | 'Waitlisted' | 'Cancelled'>('Confirmed');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setPnrno(initialData.pnrno);
      setFirstName(initialData.firstName);
      setLastName(initialData.lastName);
      setSeatNo(initialData.seatNo);
      setTrainName(initialData.trainName);
      setTravelDate(initialData.travelDate);
      setTime(initialData.time);
      setMobile(initialData.mobile);
      setClassType(initialData.classType || 'CC');
      setAmount(initialData.amount || 1450);
      setStatus(initialData.status || 'Confirmed');
    } else {
      setPnrno(generatePnr());
      setFirstName('');
      setLastName('');
      setSeatNo('S3-24');
      setTrainName(AVAILABLE_TRAINS[0]);
      setTravelDate(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]);
      setTime('07:30 AM');
      setMobile('');
      setClassType('CC');
      setAmount(1450);
      setStatus('Confirmed');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!pnrno.trim()) newErrors.pnrno = 'PNR number is required.';
    if (!firstName.trim()) newErrors.firstName = 'First Name is required.';
    if (!lastName.trim()) newErrors.lastName = 'Last Name is required.';
    if (!seatNo.trim()) newErrors.seatNo = 'Seat Number is required.';
    if (!trainName.trim()) newErrors.trainName = 'Train Name is required.';
    if (!travelDate.trim()) newErrors.travelDate = 'Travel Date is required.';
    if (!time.trim()) newErrors.time = 'Time is required.';

    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(mobile.replace(/[\s-]/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      pnrno,
      firstName,
      lastName,
      seatNo,
      trainName,
      travelDate,
      time,
      mobile,
      classType,
      amount,
      status
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans">
      <div className="bg-white border border-[#D8D5D1] rounded-3xl max-w-2xl w-full text-[#2B2D2D] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#E6E6E6] flex items-center justify-between bg-[#F7F7F7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D8F9B8] text-[#2B2D2D] rounded-xl flex items-center justify-center font-bold">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2B2D2D]">
                {isEditing ? 'Edit Train Booking Record' : 'Create New Train Booking'}
              </h3>
              <p className="text-xs text-[#666666]">
                dbo.Trainbooking • ADO.NET SqlClient Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8C8C8C] hover:text-[#2B2D2D] rounded-lg hover:bg-[#E6E6E6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* PNR Field */}
          <div>
            <label className="block text-xs font-bold text-[#2B2D2D] mb-1">
              PNR Number (Pnrno)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pnrno}
                onChange={(e) => setPnrno(e.target.value.toUpperCase())}
                readOnly={isEditing}
                placeholder="PNR98765432"
                className={`flex-1 bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#2B2D2D] ${
                  isEditing ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              />
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setPnrno(generatePnr())}
                  className="px-3.5 py-2 bg-[#F7F7F7] hover:bg-[#E6E6E6] text-[#2B2D2D] text-xs font-bold rounded-xl border border-[#D8D5D1] flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto PNR</span>
                </button>
              )}
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2B2D2D] mb-1">
                First Name (FirstName)
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Srivenkata"
                className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B2D2D]"
              />
              {errors.firstName && <p className="text-xs text-rose-600 mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2D2D] mb-1">
                Last Name (LastName)
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Kishore"
                className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B2D2D]"
              />
              {errors.lastName && <p className="text-xs text-rose-600 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Seat No & Class */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2B2D2D] mb-1">
                Seat Number (SeatNo)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={seatNo}
                  onChange={(e) => setSeatNo(e.target.value.toUpperCase())}
                  placeholder="S3-15"
                  className="flex-1 bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] font-mono font-bold text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2B2D2D]"
                />
                <button
                  type="button"
                  onClick={() => onOpenSeatMap(seatNo, (s) => setSeatNo(s))}
                  className="px-3 py-2 bg-[#D8F9B8] text-[#2B2D2D] text-xs font-bold rounded-xl border border-[#2B2D2D]/20 shrink-0"
                >
                  Seat Map
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2D2D] mb-1">
                Class Type
              </label>
              <select
                value={classType}
                onChange={(e) => setClassType(e.target.value as any)}
                className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B2D2D]"
              >
                <option value="CC">AC Chair Car (CC) - ₹1,450</option>
                <option value="1A">First AC (1A) - ₹3,400</option>
                <option value="2A">AC 2 Tier (2A) - ₹2,400</option>
                <option value="3A">AC 3 Tier (3A) - ₹1,650</option>
                <option value="EC">Executive Chair (EC) - ₹1,980</option>
                <option value="SL">Sleeper Class (SL) - ₹650</option>
              </select>
            </div>
          </div>

          {/* Train Selection */}
          <div>
            <label className="block text-xs font-bold text-[#2B2D2D] mb-1">
              Train Name (TrainName)
            </label>
            <select
              value={trainName}
              onChange={(e) => setTrainName(e.target.value)}
              className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#2B2D2D]"
            >
              {AVAILABLE_TRAINS.map((train) => (
                <option key={train} value={train}>{train}</option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2B2D2D] mb-1">
                Travel Date
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] font-mono text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2B2D2D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2D2D] mb-1">
                Departure Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="06:30 AM"
                className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] font-mono text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2B2D2D]"
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-xs font-bold text-[#2B2D2D] mb-1">
              Mobile Contact Number
            </label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="9876543210"
              className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] font-mono text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2B2D2D]"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E6E6E6]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#666666] hover:bg-[#F7F7F7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#2B2D2D] hover:bg-stone-800 text-white shadow flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#D8F9B8]" />
              <span>{isEditing ? 'Update Booking' : 'Save Booking'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
