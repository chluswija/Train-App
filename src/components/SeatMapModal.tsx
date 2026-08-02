import React, { useState } from 'react';
import { X, CheckCircle2, Train, Info } from 'lucide-react';

interface SeatMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSeat: string;
  onSelectSeat: (seatNo: string) => void;
  trainName: string;
}

export const SeatMapModal: React.FC<SeatMapModalProps> = ({
  isOpen,
  onClose,
  currentSeat,
  onSelectSeat,
  trainName
}) => {
  const [selectedCoach, setSelectedCoach] = useState<'S3' | 'B1' | 'A1' | 'CC'>('S3');
  const [selectedSeatTemp, setSelectedSeatTemp] = useState<string>(currentSeat || 'S3-15');

  if (!isOpen) return null;

  const seats = Array.from({ length: 24 }, (_, i) => {
    const seatNum = i + 1;
    let type = 'Lower Berth';
    if (seatNum % 8 === 1 || seatNum % 8 === 4) type = 'Lower';
    else if (seatNum % 8 === 2 || seatNum % 8 === 5) type = 'Middle';
    else if (seatNum % 8 === 3 || seatNum % 8 === 6) type = 'Upper';
    else if (seatNum % 8 === 7) type = 'Side Lower';
    else type = 'Side Upper';

    return {
      id: `${selectedCoach}-${seatNum.toString().padStart(2, '0')}`,
      num: seatNum,
      type
    };
  });

  const handleConfirm = () => {
    onSelectSeat(selectedSeatTemp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans">
      <div className="bg-white border border-[#D8D5D1] rounded-3xl max-w-2xl w-full text-[#2B2D2D] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E6E6E6] flex items-center justify-between bg-[#F7F7F7]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#D8F9B8] text-[#2B2D2D] rounded-xl flex items-center justify-center font-bold">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#2B2D2D] text-base">Select Train Seat</h3>
              <p className="text-xs text-[#666666]">{trainName || 'Express Train Coach'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8C8C8C] hover:text-[#2B2D2D] rounded-lg hover:bg-[#E6E6E6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Coach Selector */}
        <div className="p-4 bg-[#F7F7F7] border-b border-[#E6E6E6] flex items-center justify-between gap-2 overflow-x-auto">
          <span className="text-xs text-[#666666] font-bold uppercase tracking-wider shrink-0">
            Select Coach:
          </span>
          <div className="flex items-center gap-2">
            {(['S3', 'B1', 'A1', 'CC'] as const).map((coach) => (
              <button
                key={coach}
                onClick={() => {
                  setSelectedCoach(coach);
                  setSelectedSeatTemp(`${coach}-01`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCoach === coach
                    ? 'bg-[#2B2D2D] text-white shadow'
                    : 'bg-white text-[#2B2D2D] border border-[#D8D5D1] hover:bg-[#F7F7F7]'
                }`}
              >
                {coach === 'S3' && 'S3 (Sleeper)'}
                {coach === 'B1' && 'B1 (3AC Tier)'}
                {coach === 'A1' && 'A1 (2AC Tier)'}
                {coach === 'CC' && 'CC (AC Chair)'}
              </button>
            ))}
          </div>
        </div>

        {/* Coach Layout Display */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-6 gap-2 sm:gap-3 p-4 bg-[#F7F7F7] rounded-2xl border border-[#E6E6E6]">
            {seats.map((seat) => {
              const isSelected = selectedSeatTemp === seat.id;
              return (
                <button
                  key={seat.id}
                  onClick={() => setSelectedSeatTemp(seat.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center min-h-[60px] ${
                    isSelected
                      ? 'bg-[#2B2D2D] border-[#2B2D2D] text-white font-bold shadow'
                      : 'bg-white border-[#D8D5D1] text-[#2B2D2D] hover:bg-[#F7F7F7]'
                  }`}
                >
                  <span className="font-mono font-bold text-xs">{seat.id}</span>
                  <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-[#D8F9B8]' : 'text-[#666666]'}`}>
                    {seat.type}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-[#F7F7F7] border border-[#E6E6E6] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#2B2D2D]">
              <Info className="w-4 h-4 text-[#2B2D2D] shrink-0" />
              <span>Selected Seat: <strong className="font-mono">{selectedSeatTemp}</strong></span>
            </div>
            <span className="text-[#2B2D2D] text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2B2D2D]" />
              Available
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E6E6E6] flex items-center justify-end gap-3 bg-[#F7F7F7]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#666666] hover:bg-[#E6E6E6]"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#2B2D2D] hover:bg-stone-800 text-white shadow flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D8F9B8]" />
            <span>Confirm Seat ({selectedSeatTemp})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
