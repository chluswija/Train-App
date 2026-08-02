import React from 'react';
import { TrainBooking } from '../types';
import { X, Printer, Train, CheckCircle2, QrCode, Calendar, Clock, Phone, User, ShieldCheck } from 'lucide-react';

interface TicketReceiptProps {
  booking: TrainBooking | null;
  onClose: () => void;
}

export const TicketReceipt: React.FC<TicketReceiptProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans">
      <div className="bg-white text-[#2B2D2D] rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-[#D8D5D1]">
        {/* Header */}
        <div className="bg-[#2B2D2D] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D8F9B8] text-[#2B2D2D] rounded-xl flex items-center justify-center font-bold">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#D8F9B8] font-bold">
                  NLCI RAIL RESERVATION
                </span>
                <span className="text-[#D8F9B8] text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  CONFIRMED
                </span>
              </div>
              <h3 className="font-bold text-base text-white mt-0.5">{booking.trainName}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ticket Details Body */}
        <div className="p-6 space-y-5" id="printable-ticket">
          {/* Top Bar: PNR & Fare */}
          <div className="flex items-center justify-between p-4 bg-[#F7F7F7] rounded-2xl border border-[#E6E6E6]">
            <div>
              <span className="text-xs text-[#666666] uppercase tracking-wider block font-bold">
                PNR Number
              </span>
              <span className="text-xl font-mono font-bold text-[#2B2D2D]">{booking.pnrno}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#666666] uppercase tracking-wider block font-bold">
                Total Fare
              </span>
              <span className="text-xl font-bold text-[#2B2D2D]">₹{booking.amount || 1450}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E6E6E6]">
              <span className="text-[#666666] flex items-center gap-1 mb-1 font-bold">
                <User className="w-3.5 h-3.5 text-[#2B2D2D]" /> Passenger
              </span>
              <p className="font-bold text-[#2B2D2D] text-sm">{booking.firstName} {booking.lastName}</p>
            </div>

            <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E6E6E6]">
              <span className="text-[#666666] flex items-center gap-1 mb-1 font-bold">
                <Train className="w-3.5 h-3.5 text-[#2B2D2D]" /> Seat / Coach
              </span>
              <p className="font-bold text-[#2B2D2D] text-sm font-mono">{booking.seatNo}</p>
            </div>

            <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E6E6E6]">
              <span className="text-[#666666] flex items-center gap-1 mb-1 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2B2D2D]" /> Class
              </span>
              <p className="font-bold text-[#2B2D2D] text-sm font-mono">{booking.classType || 'CC'}</p>
            </div>

            <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E6E6E6]">
              <span className="text-[#666666] flex items-center gap-1 mb-1 font-bold">
                <Calendar className="w-3.5 h-3.5 text-[#2B2D2D]" /> Date
              </span>
              <p className="font-bold text-[#2B2D2D] text-sm font-mono">{booking.travelDate}</p>
            </div>

            <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E6E6E6]">
              <span className="text-[#666666] flex items-center gap-1 mb-1 font-bold">
                <Clock className="w-3.5 h-3.5 text-[#2B2D2D]" /> Time
              </span>
              <p className="font-bold text-[#2B2D2D] text-sm font-mono">{booking.time}</p>
            </div>

            <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E6E6E6]">
              <span className="text-[#666666] flex items-center gap-1 mb-1 font-bold">
                <Phone className="w-3.5 h-3.5 text-[#2B2D2D]" /> Contact
              </span>
              <p className="font-bold text-[#2B2D2D] text-sm font-mono">{booking.mobile}</p>
            </div>
          </div>

          {/* QR & ADO.NET Info */}
          <div className="flex items-center justify-between p-4 bg-[#2B2D2D] text-white rounded-2xl">
            <div className="space-y-1">
              <span className="text-[10px] text-stone-300 font-mono uppercase font-bold block">
                ADO.NET Verified Record
              </span>
              <p className="text-xs text-[#D8F9B8] font-mono">
                SELECT * FROM dbo.Trainbooking WHERE Pnrno = '{booking.pnrno}'
              </p>
            </div>
            <div className="p-2 bg-white rounded-xl text-[#2B2D2D] shrink-0">
              <QrCode className="w-9 h-9" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F7F7F7] border-t border-[#E6E6E6] flex items-center justify-between">
          <span className="text-xs text-[#666666]">
            NLCI Rail Ticket • ADO.NET Portal
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#2B2D2D] hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5 text-[#D8F9B8]" />
              <span>Print Ticket</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#E6E6E6] hover:bg-[#D8D5D1] text-[#2B2D2D] text-xs font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
