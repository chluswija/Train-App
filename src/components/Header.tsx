import React, { useRef, useState, useEffect } from 'react';
import { ActiveTab, UserProfile, ThemeMode } from '../types';
import { DEFAULT_TEST_USERS } from '../data/initialData';
import {
  Train,
  Code2,
  Database,
  Award,
  Download,
  HelpCircle,
  ShieldCheck,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Palette,
  Users
} from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  themeMode: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  onSelectPersona: (persona: UserProfile) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenZipModal: () => void;
  onOpenAskHr: () => void;
  onLogout: () => void;
  bookingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  themeMode,
  onSelectTheme,
  onSelectPersona,
  activeTab,
  setActiveTab,
  onOpenZipModal,
  onOpenAskHr,
  onLogout,
  bookingCount
}) => {
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const checkScroll = () => {
    if (tabsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsScrollRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = tabsScrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (tabsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      tabsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isAdmin = user.role === 'admin';

  const themes: { id: ThemeMode; name: string; iconBg: string; desc: string }[] = [
    { id: 'dark-emerald', name: 'Midnight Charcoal', iconBg: 'bg-[#1e2020] border-[#D8F9B8]', desc: 'Dark & Mint' },
    { id: 'light-pearl', name: 'Pearl Daylight', iconBg: 'bg-white border-slate-300', desc: 'Crisp Light' },
    { id: 'navy-gold', name: 'Royal Express', iconBg: 'bg-[#1c2541] border-amber-400', desc: 'Navy & Gold' },
    { id: 'forest-mint', name: 'Pine Mint', iconBg: 'bg-[#0f291e] border-emerald-400', desc: 'Zen Emerald' },
  ];

  return (
    <header className="sticky top-0 z-40 pt-3 pb-2 px-3 sm:px-6 max-w-7xl mx-auto w-full font-sans">
      <nav className="header-nav-bg text-white rounded-2xl p-3 sm:p-4 shadow-xl border border-white/10 flex flex-col gap-3 transition-colors duration-300">
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-white/10">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent text-accent-foreground rounded-xl flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <Train className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-bold text-base sm:text-xl text-white tracking-tight leading-none">
                  NLCI Express Train Portal
                </h1>
                <span className="bg-accent text-accent-foreground font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {isAdmin ? 'ADMIN DASHBOARD' : 'PASSENGER PORTAL'}
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                {isAdmin
                  ? 'Full Database & ADO.NET Management Engine'
                  : `Logged in as Passenger: ${user.employeeName}`}
              </p>
            </div>
          </div>

          {/* Quick Controls: Persona Switcher, Theme Changer, Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* 1. Default User Persona Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsPersonaOpen(!isPersonaOpen);
                  setIsThemeOpen(false);
                }}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-1.5 border border-white/15 text-xs text-white transition-all font-medium"
                title="Switch Default Test Persona"
              >
                <Users className="w-3.5 h-3.5 text-accent" />
                <span className="font-semibold max-w-[120px] sm:max-w-[160px] truncate">{user.employeeName}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                  isAdmin ? 'bg-amber-400/20 text-amber-300' : 'bg-sky-400/20 text-sky-300'
                }`}>
                  {user.role}
                </span>
              </button>

              {/* Persona Selector Dropdown - Bounds Constrained */}
              {isPersonaOpen && (
                <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-[#1E2020] border border-stone-700 rounded-2xl shadow-2xl p-2 z-50 text-stone-100 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-stone-400 uppercase tracking-wider font-bold border-b border-stone-800 pb-2 mb-1">
                    Select Test User Persona
                  </div>
                  {DEFAULT_TEST_USERS.map((persona) => {
                    const isSelected = persona.username === user.username;
                    return (
                      <button
                        key={persona.username}
                        onClick={() => {
                          onSelectPersona(persona);
                          setIsPersonaOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-accent text-accent-foreground font-bold shadow-md'
                            : 'hover:bg-stone-800 text-stone-200'
                        }`}
                      >
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className={`font-semibold leading-tight truncate ${isSelected ? 'text-accent-foreground' : 'text-stone-100'}`}>
                            {persona.employeeName}
                          </span>
                          <span className={`text-[10px] truncate ${isSelected ? 'text-accent-foreground/80' : 'text-stone-400'}`}>
                            {persona.department}
                          </span>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase shrink-0 ${
                          isSelected
                            ? (persona.role === 'admin' ? 'bg-stone-900 text-amber-300' : 'bg-stone-900 text-sky-300')
                            : (persona.role === 'admin' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30')
                        }`}>
                          {persona.role}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Full Environment Theme Changer */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsThemeOpen(!isThemeOpen);
                  setIsPersonaOpen(false);
                }}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-1.5 border border-white/15 text-xs text-white transition-all font-medium"
                title="Change Environment Theme"
              >
                <Palette className="w-3.5 h-3.5 text-accent" />
                <span className="hidden sm:inline">Theme</span>
              </button>

              {isThemeOpen && (
                <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] bg-[#1E2020] border border-stone-700 rounded-2xl shadow-2xl p-2 z-50 text-stone-100 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-mono text-stone-400 uppercase tracking-wider font-bold border-b border-stone-800 pb-2 mb-1">
                    Environment Theme
                  </div>
                  {themes.map((t) => {
                    const isSelected = themeMode === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          onSelectTheme(t.id);
                          setIsThemeOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? 'bg-accent text-accent-foreground font-bold shadow-md'
                            : 'hover:bg-stone-800 text-stone-200'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border ${t.iconBg} shrink-0`} />
                        <div className="flex flex-col">
                          <span className={isSelected ? 'text-accent-foreground' : 'text-stone-100'}>{t.name}</span>
                          <span className={`text-[9px] ${isSelected ? 'text-accent-foreground/80' : 'text-stone-400'}`}>{t.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Support / AskHR */}
            <button
              onClick={onOpenAskHr}
              className="p-2 text-stone-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl border border-white/15 transition-all text-xs font-medium flex items-center gap-1"
              title="AskHR Support"
            >
              <HelpCircle className="w-4 h-4 text-accent" />
              <span className="hidden sm:inline">Support</span>
            </button>

            {/* Export Solution (Admin only) */}
            {isAdmin && (
              <button
                onClick={onOpenZipModal}
                className="bg-accent hover:opacity-90 text-accent-foreground font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export Solution</span>
              </button>
            )}

            {/* Logout */}
            <button
              onClick={onLogout}
              className="p-2 text-rose-300 hover:bg-rose-950/50 rounded-xl border border-white/15 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Links (Filtered by Role) */}
        <div className="relative flex items-center w-full">
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-0 z-10 p-1.5 bg-black/80 text-accent border border-stone-700 rounded-xl shadow-lg hover:bg-black transition-all"
              aria-label="Slide Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <div
            ref={tabsScrollRef}
            className="flex items-center gap-2 overflow-x-auto scroll-smooth touch-pan-x select-none scrollbar-none w-full py-0.5 px-0.5"
          >
            {/* Always visible: Train Booking Portal */}
            <button
              onClick={() => setActiveTab('portal')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === 'portal'
                  ? 'bg-white text-slate-900 font-bold shadow-md'
                  : 'text-stone-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Train className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Train Booking Portal' : 'My Train Ticket & Bookings'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'portal' ? 'bg-slate-900 text-white' : 'bg-stone-800 text-stone-300'
              }`}>
                {bookingCount}
              </span>
            </button>

            {/* Admin-Only Tabs */}
            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    activeTab === 'code'
                      ? 'bg-white text-slate-900 font-bold shadow-md'
                      : 'text-stone-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>ADO.NET Code Studio</span>
                </button>

                <button
                  onClick={() => setActiveTab('sql')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    activeTab === 'sql'
                      ? 'bg-white text-slate-900 font-bold shadow-md'
                      : 'text-stone-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>SQL Engine Console</span>
                </button>

                <button
                  onClick={() => setActiveTab('exam')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    activeTab === 'exam'
                      ? 'bg-white text-slate-900 font-bold shadow-md'
                      : 'text-stone-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Case Study Evaluation</span>
                </button>
              </>
            )}
          </div>

          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-0 z-10 p-1.5 bg-black/80 text-accent border border-stone-700 rounded-xl shadow-lg hover:bg-black transition-all"
              aria-label="Slide Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};
