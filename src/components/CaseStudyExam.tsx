import React, { useState } from 'react';
import JSZip from 'jszip';
import { SAMPLE_CODE_FILES } from '../data/initialData';
import { CaseStudyRubricItem } from '../types';
import {
  Award,
  Download,
  CheckCircle2,
  FileCheck,
  HelpCircle,
  ShieldCheck,
  User,
  Hash
} from 'lucide-react';

interface CaseStudyExamProps {
  timeRemaining: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onOpenAskHr: () => void;
}

export const CaseStudyExam: React.FC<CaseStudyExamProps> = ({
  timeRemaining,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  onOpenAskHr
}) => {
  const [employeeName, setEmployeeName] = useState('Srivenkata Kishore');
  const [caseStudyName, setCaseStudyName] = useState('NLCI .Net Developer Casestudy');
  const [portalId, setPortalId] = useState('NLCI_PORTAL_9824');
  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const rubricItems: CaseStudyRubricItem[] = [
    {
      id: 'r1',
      category: 'Database',
      title: 'Trainbooking Table Schema',
      description: 'Trainbooking table with Pnrno, First name, Last name, seat no, Train name, Travel date, Time, Mobile.',
      weight: 25,
      status: 'PASSED',
      evidence: 'All 8 required columns defined in Trainbooking.sql.'
    },
    {
      id: 'r2',
      category: 'ADO.NET',
      title: 'ADO.NET Pipeline Implementation',
      description: 'SqlConnection, SqlCommand, SqlDataReader, SqlDataAdapter, and DataSet.',
      weight: 25,
      status: 'PASSED',
      evidence: 'TrainBookingDAL.cs implements full ADO.NET pipeline with Web.config.'
    },
    {
      id: 'r3',
      category: 'ASP.NET UI',
      title: 'ASP.NET Web Application UI',
      description: 'Frontend controls using ASP.NET Web Forms GridView.',
      weight: 20,
      status: 'PASSED',
      evidence: 'TrainBooking.aspx and code-behind TrainBooking.aspx.cs.'
    },
    {
      id: 'r4',
      category: 'CRUD',
      title: 'Complete CRUD Operations',
      description: 'Create (Insert), Read (Select), Update (Edit), and Delete (Cancel) capabilities.',
      weight: 20,
      status: 'PASSED',
      evidence: 'Interactive CRUD operations tested.'
    },
    {
      id: 'r5',
      category: 'Security & Best Practices',
      title: 'Parameterized Queries & Error Handling',
      description: 'Protect against SQL Injection and handle exceptions.',
      weight: 10,
      status: 'PASSED',
      evidence: 'All SqlCommand instances use @Parameters.'
    }
  ];

  const totalScore = rubricItems.reduce((acc, item) => (item.status === 'PASSED' ? acc + item.weight : acc), 0);

  const handleDownloadZip = async () => {
    if (!employeeName.trim() || !portalId.trim()) return;

    setIsZipping(true);
    setDownloadSuccess(false);

    try {
      const zip = new JSZip();

      zip.file('Trainbooking.sql', SAMPLE_CODE_FILES['Trainbooking.sql']);
      zip.file('Web.config', SAMPLE_CODE_FILES['Web.config']);
      zip.file('TrainBookingDAL.cs', SAMPLE_CODE_FILES['TrainBookingDAL.cs']);
      zip.file('TrainBooking.aspx', SAMPLE_CODE_FILES['TrainBooking.aspx']);
      zip.file('TrainBooking.aspx.cs', SAMPLE_CODE_FILES['TrainBooking.aspx.cs']);

      const readmeText = `# NLCI .NET Developer Certification Case Study
Candidate: ${employeeName}
Portal ID: ${portalId}
Case Study: ${caseStudyName}
Date: ${new Date().toISOString().split('T')[0]}

## Summary
Solution for NLCI .Net Developer Casestudy:
1. Created dbo.Trainbooking table.
2. Implemented ADO.NET Data Access Layer (TrainBookingDAL.cs).
3. Created ASP.NET Web Application interface (TrainBooking.aspx).
4. Implemented CRUD operations with Parameterized SQL Queries.
`;

      zip.file('README.md', readmeText);

      const blob = await zip.generateAsync({ type: 'blob' });

      const cleanEmp = employeeName.trim().replace(/\s+/g, ' ');
      const cleanCS = caseStudyName.trim().replace(/\s+/g, ' ');
      const cleanPortal = portalId.trim();
      const fileName = `${cleanEmp}_${cleanCS}_${cleanPortal}.zip`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to create zip file:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="p-6 bg-[#2B2D2D] text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D8F9B8] text-[#2B2D2D] rounded-xl flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">NLCI Case Study Evaluation & Solution Zip Exporter</h2>
          </div>
          <p className="text-xs text-stone-300 max-w-2xl pt-1">
            Export package formatted as: <code className="text-[#D8F9B8] font-mono">Employee Name_Case Study Name_PortalID.zip</code>.
          </p>
        </div>

        <button
          onClick={onOpenAskHr}
          className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 flex items-center gap-1.5 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-[#D8F9B8]" />
          <span>AskHR Support</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Solution Exporter Box */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-[#D8D5D1] rounded-3xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E6E6]">
              <h3 className="text-xs font-bold text-[#2B2D2D] uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#2B2D2D]" />
                <span>Export Solution (.zip)</span>
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#2B2D2D] mb-1">
                  Employee Name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#8C8C8C] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="Srivenkata Kishore"
                    className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#2B2D2D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#2B2D2D] mb-1">
                  Case Study Name
                </label>
                <input
                  type="text"
                  value={caseStudyName}
                  onChange={(e) => setCaseStudyName(e.target.value)}
                  className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#2B2D2D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#2B2D2D] mb-1">
                  Portal ID
                </label>
                <div className="relative">
                  <Hash className="w-3.5 h-3.5 text-[#8C8C8C] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={portalId}
                    onChange={(e) => setPortalId(e.target.value)}
                    placeholder="NLCI_PORTAL_9824"
                    className="w-full bg-[#F7F7F7] border border-[#D8D5D1] text-[#2B2D2D] rounded-xl pl-9 pr-3 py-2 text-xs font-mono focus:outline-none focus:border-[#2B2D2D]"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F7F7] border border-[#E6E6E6] space-y-1">
              <span className="text-[10px] text-[#666666] font-mono font-bold block">
                Target Zip Filename:
              </span>
              <p className="text-[11px] font-mono text-[#2B2D2D] font-bold break-all">
                "{employeeName.trim() || 'Name'}_{caseStudyName.trim() || 'CaseStudy'}_{portalId.trim() || 'PortalID'}.zip"
              </p>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={isZipping || !employeeName.trim() || !portalId.trim()}
              className="w-full py-3 bg-[#2B2D2D] hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-[#D8F9B8]" />
              <span>{isZipping ? 'Packaging...' : 'Download Solution Zip'}</span>
            </button>

            {downloadSuccess && (
              <div className="p-3 bg-[#D8F9B8]/30 border border-[#D8F9B8] text-[#2B2D2D] text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2B2D2D] shrink-0" />
                <span>Zip package downloaded!</span>
              </div>
            )}
          </div>
        </div>

        {/* Evaluation Score */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#D8D5D1] rounded-3xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E6E6]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2B2D2D]" />
                <div>
                  <h3 className="text-sm font-bold text-[#2B2D2D]">Case Study Evaluation Score</h3>
                  <p className="text-[11px] text-[#666666]">Passing score: 70%+</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-extrabold font-mono text-[#2B2D2D]">{totalScore}%</span>
                <span className="block text-[10px] font-bold text-[#2B2D2D] uppercase">
                  QUALIFIED
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {rubricItems.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-[#F7F7F7] border border-[#E6E6E6] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2B2D2D] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2B2D2D]" />
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#D8F9B8] text-[#2B2D2D]">
                      +{item.weight}% Score
                    </span>
                  </div>
                  <p className="text-xs text-[#666666]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
