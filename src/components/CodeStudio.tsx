import React, { useState } from 'react';
import { SAMPLE_CODE_FILES } from '../data/initialData';
import {
  Code2,
  Copy,
  Check,
  Database,
  Layers,
  BookOpen
} from 'lucide-react';

export const CodeStudio: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<keyof typeof SAMPLE_CODE_FILES>('TrainBookingDAL.cs');
  const [copied, setCopied] = useState(false);

  const codeContent = SAMPLE_CODE_FILES[selectedFile] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fileIcons: Record<string, string> = {
    'Trainbooking.sql': '📊',
    'Web.config': '⚙️',
    'TrainBookingDAL.cs': '⚡',
    'TrainBooking.aspx': '🌐',
    'TrainBooking.aspx.cs': '💻'
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Overview Banner */}
      <div className="p-6 bg-[#2B2D2D] text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D8F9B8] text-[#2B2D2D] rounded-xl flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">ADO.NET & ASP.NET Code Studio</h2>
          </div>
          <p className="text-xs text-stone-300 max-w-2xl pt-1">
            Complete C# ADO.NET Data Access Layer (DAL), Web.config connection strings, and Web Forms controls.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-4 py-2.5 bg-[#D8F9B8] hover:bg-[#cbf7a3] text-[#2B2D2D] text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2"
        >
          {copied ? <Check className="w-4 h-4 text-[#2B2D2D]" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : `Copy ${selectedFile}`}</span>
        </button>
      </div>

      {/* Main Studio View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Solution Explorer */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-[#D8D5D1] rounded-3xl p-4 shadow-md">
            <h3 className="text-xs font-bold text-[#2B2D2D] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2B2D2D]" />
              <span>Solution Explorer</span>
            </h3>

            <div className="space-y-1.5">
              {(Object.keys(SAMPLE_CODE_FILES) as Array<keyof typeof SAMPLE_CODE_FILES>).map((fileName) => {
                const isSelected = selectedFile === fileName;
                return (
                  <button
                    key={fileName}
                    onClick={() => setSelectedFile(fileName)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#2B2D2D] text-white font-bold shadow'
                        : 'text-[#2B2D2D] hover:bg-[#F7F7F7]'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span>{fileIcons[fileName] || '📄'}</span>
                      <span className="truncate">{fileName}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Concepts Card */}
          <div className="bg-white border border-[#D8D5D1] rounded-3xl p-4 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-[#2B2D2D] uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2B2D2D]" />
              <span>ADO.NET Concepts</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F7F7F7] border border-[#E6E6E6]">
                <span className="font-mono text-[#2B2D2D] font-bold block mb-0.5">SqlConnection</span>
                <p className="text-[11px] text-[#666666]">
                  Establishes active connection channel using Web.config connection strings.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F7F7F7] border border-[#E6E6E6]">
                <span className="font-mono text-[#2B2D2D] font-bold block mb-0.5">SqlCommand & Parameters</span>
                <p className="text-[11px] text-[#666666]">
                  Executes queries with <code className="text-[#2B2D2D] font-bold">Parameters.AddWithValue()</code> to prevent SQL Injection.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F7F7F7] border border-[#E6E6E6]">
                <span className="font-mono text-[#2B2D2D] font-bold block mb-0.5">ExecuteNonQuery()</span>
                <p className="text-[11px] text-[#666666]">
                  Executes INSERT, UPDATE, and DELETE commands, returning affected rows count.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-3">
          <div className="bg-[#2B2D2D] text-white border border-stone-700 rounded-3xl shadow-xl overflow-hidden flex flex-col h-full min-h-[550px]">
            <div className="p-3.5 bg-stone-800 border-b border-stone-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-base">{fileIcons[selectedFile]}</span>
                <span className="font-mono text-xs font-bold text-white">{selectedFile}</span>
              </div>

              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-stone-700 hover:bg-stone-600 text-stone-200 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1 font-mono"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#D8F9B8]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-4 overflow-x-auto flex-1 font-mono text-xs text-[#D8F9B8] bg-[#2B2D2D] leading-relaxed scrollbar-thin">
              <pre className="text-[#D8F9B8]">
                <code>{codeContent}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
