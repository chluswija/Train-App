import React, { useState } from 'react';
import { AskHrTicket } from '../types';
import { HelpCircle, X, Send, CheckCircle2, MessageSquare } from 'lucide-react';

interface AskHrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskHrModal: React.FC<AskHrModalProps> = ({ isOpen, onClose }) => {
  const [portalId, setPortalId] = useState('NLCI_PORTAL_9824');
  const [employeeName, setEmployeeName] = useState('Srivenkata Kishore');
  const [queryType, setQueryType] = useState<'Clarification' | 'Technical Issue' | 'Extension Request' | 'Portal Login'>('Clarification');
  const [subject, setSubject] = useState('Clarification on Trainbooking Column Names');
  const [message, setMessage] = useState('Hello HR team, regarding the Trainbooking table requirement, please confirm if the Seat No column supports string coach identifiers like S3-42.');

  const [tickets, setTickets] = useState<AskHrTicket[]>([
    {
      id: 'TKT-1082',
      portalId: 'NLCI_PORTAL_9824',
      employeeName: 'Srivenkata Kishore',
      subject: 'Clarification on ADO.NET Connection String Format',
      queryType: 'Clarification',
      message: 'Does the evaluation environment support SQL Server Express Integrated Security in Web.config?',
      status: 'Resolved',
      timestamp: '2026-07-26 14:20:00',
      response: 'Yes, Integrated Security=True or Standard SqlConnectionString is supported.'
    }
  ]);

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const newTicket: AskHrTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      portalId,
      employeeName,
      subject,
      queryType,
      message,
      status: 'Submitted',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      response: 'Ticket received by HR SME team. Response will be dispatched shortly.'
    };

    setTickets([newTicket, ...tickets]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans">
      <div className="bg-white border border-[#D8D5D1] rounded-3xl max-w-xl w-full text-[#2B2D2D] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#E6E6E6] flex items-center justify-between bg-[#F7F7F7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D8F9B8] text-[#2B2D2D] rounded-xl flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#2B2D2D]">AskHR Support Helpdesk</h3>
              <p className="text-xs text-[#666666]">NLCI HR & SME Technical Team</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8C8C8C] hover:text-[#2B2D2D] rounded-lg hover:bg-[#E6E6E6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#2B2D2D] mb-1">Candidate Name</label>
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2B2D2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2D2D] mb-1">Portal ID</label>
                <input
                  type="text"
                  value={portalId}
                  onChange={(e) => setPortalId(e.target.value)}
                  className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#2B2D2D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#2B2D2D] mb-1">Category</label>
                <select
                  value={queryType}
                  onChange={(e) => setQueryType(e.target.value as any)}
                  className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2B2D2D]"
                >
                  <option value="Clarification">Case Study Clarification</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Extension Request">Extension Request</option>
                  <option value="Portal Login">Portal Login</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2D2D] mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Summary..."
                  className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2B2D2D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2D2D] mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Type your message..."
                className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] rounded-xl p-3 text-xs focus:outline-none focus:border-[#2B2D2D] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#2B2D2D] hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-[#D8F9B8]" />
              <span>Submit Ticket</span>
            </button>
          </form>

          {submitted && (
            <div className="p-3 bg-[#D8F9B8]/30 border border-[#D8F9B8] text-[#2B2D2D] text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2B2D2D] shrink-0" />
              <span>AskHR Ticket submitted successfully!</span>
            </div>
          )}

          {/* Ticket History */}
          <div className="pt-3 border-t border-[#E6E6E6] space-y-2">
            <h4 className="text-xs font-bold text-[#2B2D2D] uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#2B2D2D]" /> Ticket History
            </h4>

            {tickets.map((tkt) => (
              <div key={tkt.id} className="p-3 rounded-2xl bg-[#F7F7F7] border border-[#E6E6E6] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#2B2D2D] font-bold">{tkt.id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D8F9B8] text-[#2B2D2D] font-bold">
                    {tkt.status}
                  </span>
                </div>
                <p className="font-bold text-[#2B2D2D]">{tkt.subject}</p>
                <p className="text-[11px] text-[#666666]">{tkt.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
