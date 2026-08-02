import React, { useState, useEffect } from 'react';
import { TrainBooking, ActiveTab, AdoNetLog, SqlQueryResult, UserProfile, UserRole, AppStage, ThemeMode } from './types';
import { INITIAL_TRAIN_BOOKINGS, DEFAULT_TEST_USERS } from './data/initialData';
import { LoginPage } from './components/LoginPage';
import { RoleSelectionPage } from './components/RoleSelectionPage';
import { TrainQuestionnaireWizard } from './components/TrainQuestionnaireWizard';
import { TrainMainSceneDashboard } from './components/TrainMainSceneDashboard';
import { Header } from './components/Header';
import { BookingList } from './components/BookingList';
import { BookingForm } from './components/BookingForm';
import { SeatMapModal } from './components/SeatMapModal';
import { TicketReceipt } from './components/TicketReceipt';
import { CodeStudio } from './components/CodeStudio';
import { SqlConsole } from './components/SqlConsole';
import { CaseStudyExam } from './components/CaseStudyExam';
import { AskHrModal } from './components/AskHrModal';
import { Toast } from './components/Toast';

export default function App() {
  // Theme Mode State
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('nlci_theme_mode');
    return (saved as ThemeMode) || 'dark-emerald';
  });

  // User Profile & Role State (Default to Admin if none stored)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('nlci_user_profile');
    return savedUser ? JSON.parse(savedUser) : DEFAULT_TEST_USERS[0];
  });

  const [appStage, setAppStage] = useState<AppStage>('dashboard');

  // Train Bookings Database State
  const [bookings, setBookings] = useState<TrainBooking[]>(() => {
    const saved = localStorage.getItem('nlci_train_bookings');
    return saved ? JSON.parse(saved) : INITIAL_TRAIN_BOOKINGS;
  });

  // Calculate scoped tickets according to user role (Viewers ONLY see their own ticket)
  const visibleBookings = currentUser.role === 'admin'
    ? bookings
    : bookings.filter((b) => {
        const passengerName = `${b.firstName} ${b.lastName}`.toLowerCase().trim();
        const loggedInName = currentUser.employeeName.toLowerCase().trim();
        return (
          passengerName.includes(loggedInName) ||
          loggedInName.includes(b.firstName.toLowerCase().trim()) ||
          loggedInName.includes(passengerName)
        );
      });

  // Active Scene Ticket State
  const [activeSceneBooking, setActiveSceneBooking] = useState<TrainBooking | null>(() => {
    return visibleBookings.length > 0 ? visibleBookings[0] : (bookings[0] || null);
  });

  const [portalView, setPortalView] = useState<'scene' | 'table'>('scene');
  const [activeTab, setActiveTab] = useState<ActiveTab>('portal');

  // ADO.NET Audit Logs
  const [adoNetLogs, setAdoNetLogs] = useState<AdoNetLog[]>([]);

  // Modal States
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<TrainBooking | null>(null);

  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [seatMapCurrentSeat, setSeatMapCurrentSeat] = useState('S3-15');
  const [seatMapCallback, setSeatMapCallback] = useState<((seat: string) => void) | null>(null);

  const [ticketReceiptBooking, setTicketReceiptBooking] = useState<TrainBooking | null>(null);
  const [isAskHrOpen, setIsAskHrOpen] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('nlci_theme_mode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nlci_user_profile', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nlci_train_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Ensure Viewer Role is STRICTLY restricted to Portal tab only
  useEffect(() => {
    if (currentUser.role === 'viewer' && activeTab !== 'portal') {
      setActiveTab('portal');
    }
  }, [currentUser.role, activeTab]);

  // Update active scene booking when visible bookings list changes
  useEffect(() => {
    if (visibleBookings.length > 0 && !visibleBookings.some(b => b.pnrno === activeSceneBooking?.pnrno)) {
      setActiveSceneBooking(visibleBookings[0]);
    }
  }, [currentUser.username, visibleBookings.length]);

  // Handle switching default user personas
  const handleSelectPersona = (persona: UserProfile) => {
    setCurrentUser(persona);
    localStorage.setItem('nlci_user_profile', JSON.stringify(persona));

    // Find scoped booking for passenger persona
    const scoped = persona.role === 'admin'
      ? bookings
      : bookings.filter((b) => {
          const pName = `${b.firstName} ${b.lastName}`.toLowerCase();
          const uName = persona.employeeName.toLowerCase();
          return pName.includes(uName) || uName.includes(b.firstName.toLowerCase());
        });

    if (persona.role === 'viewer') {
      setActiveTab('portal');
      if (scoped.length > 0) {
        setActiveSceneBooking(scoped[0]);
      } else {
        // Auto-generate a passenger booking if missing
        const names = persona.employeeName.split(' ');
        const newP: TrainBooking = {
          pnrno: `PNR${Math.floor(10000000 + Math.random() * 90000000)}`,
          firstName: names[0] || 'Passenger',
          lastName: names[1] || 'User',
          seatNo: 'B2-14',
          trainName: 'Vande Bharat Express (20901)',
          travelDate: '2026-08-15',
          time: '06:15 AM',
          mobile: '9876543210',
          status: 'Confirmed',
          amount: 1450,
          classType: 'CC',
          createdAt: new Date().toISOString()
        };
        setBookings((prev) => [newP, ...prev]);
        setActiveSceneBooking(newP);
      }
    } else {
      if (bookings.length > 0) {
        setActiveSceneBooking(bookings[0]);
      }
    }
  };

  // Auth Handlers
  const handleLoginSuccess = (user: UserProfile, selectedRole?: UserRole) => {
    const updatedUser = selectedRole ? { ...user, role: selectedRole } : user;
    setCurrentUser(updatedUser);
    setAppStage('dashboard');
  };

  const handleLogout = () => {
    // Switch to first default user
    handleSelectPersona(DEFAULT_TEST_USERS[1]); // Rajesh Kumar
  };

  // Add Log helper
  const addAdoLog = (
    action: AdoNetLog['action'],
    pnrno: string,
    sql: string,
    params: Record<string, any>,
    rowsAffected: number,
    details: string
  ) => {
    const newLog: AdoNetLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      action,
      pnrno,
      sqlStatement: sql,
      parameters: params,
      rowsAffected,
      status: 'SUCCESS',
      details
    };

    setAdoNetLogs((prev) => [...prev, newLog]);
  };

  const handleDismissLog = (id: string) => {
    setAdoNetLogs((prev) => prev.filter((l) => l.id !== id));
  };

  // Questionnaire Wizard Launch Scene Handler
  const handleLaunchSceneFromWizard = (newBooking: TrainBooking) => {
    const existingIndex = bookings.findIndex((b) => b.pnrno === newBooking.pnrno);

    if (existingIndex >= 0) {
      const updated = [...bookings];
      updated[existingIndex] = newBooking;
      setBookings(updated);
    } else {
      setBookings([newBooking, ...bookings]);
    }

    const sql = `INSERT INTO Trainbooking (Pnrno, FirstName, LastName, SeatNo, TrainName, TravelDate, [Time], Mobile) VALUES ('${newBooking.pnrno}', '${newBooking.firstName}', '${newBooking.lastName}', '${newBooking.seatNo}', '${newBooking.trainName}', '${newBooking.travelDate}', '${newBooking.time}', '${newBooking.mobile}')`;
    addAdoLog(
      'CREATE',
      newBooking.pnrno,
      sql,
      newBooking,
      1,
      `Questionnaire saved. ADO.NET SqlCommand.ExecuteNonQuery() saved booking ${newBooking.pnrno}`
    );

    setActiveSceneBooking(newBooking);
    setPortalView('scene');
    setAppStage('dashboard');
  };

  // CRUD Handler: Create or Update Booking (Admin Only)
  const handleSaveBooking = (bookingData: Omit<TrainBooking, 'createdAt'>) => {
    if (currentUser.role === 'viewer') return; // Strict Guard

    const existingIndex = bookings.findIndex((b) => b.pnrno === bookingData.pnrno);

    if (existingIndex >= 0) {
      const updatedList = [...bookings];
      const updatedBooking = {
        ...updatedList[existingIndex],
        ...bookingData
      };
      updatedList[existingIndex] = updatedBooking;
      setBookings(updatedList);

      if (activeSceneBooking?.pnrno === bookingData.pnrno) {
        setActiveSceneBooking(updatedBooking);
      }

      const sql = `UPDATE Trainbooking SET FirstName='${bookingData.firstName}', LastName='${bookingData.lastName}', SeatNo='${bookingData.seatNo}', TrainName='${bookingData.trainName}', TravelDate='${bookingData.travelDate}', [Time]='${bookingData.time}', Mobile='${bookingData.mobile}' WHERE Pnrno='${bookingData.pnrno}'`;
      addAdoLog(
        'UPDATE',
        bookingData.pnrno,
        sql,
        bookingData,
        1,
        `ADO.NET SqlCommand.ExecuteNonQuery() updated booking ${bookingData.pnrno}`
      );
    } else {
      const newBooking: TrainBooking = {
        ...bookingData,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      setBookings([newBooking, ...bookings]);
      setActiveSceneBooking(newBooking);

      const sql = `INSERT INTO Trainbooking (Pnrno, FirstName, LastName, SeatNo, TrainName, TravelDate, [Time], Mobile) VALUES ('${bookingData.pnrno}', '${bookingData.firstName}', '${bookingData.lastName}', '${bookingData.seatNo}', '${bookingData.trainName}', '${bookingData.travelDate}', '${bookingData.time}', '${bookingData.mobile}')`;
      addAdoLog(
        'CREATE',
        bookingData.pnrno,
        sql,
        bookingData,
        1,
        `ADO.NET SqlCommand.ExecuteNonQuery() inserted 1 row for ${bookingData.pnrno}`
      );
    }
  };

  // CRUD Handler: Delete Booking (Admin Only)
  const handleDeleteBooking = (pnrno: string) => {
    if (currentUser.role === 'viewer') return; // Strict Guard

    const filtered = bookings.filter((b) => b.pnrno !== pnrno);
    setBookings(filtered);

    if (activeSceneBooking?.pnrno === pnrno) {
      setActiveSceneBooking(filtered.length > 0 ? filtered[0] : null);
    }

    const sql = `DELETE FROM Trainbooking WHERE Pnrno='${pnrno}'`;
    addAdoLog(
      'DELETE',
      pnrno,
      sql,
      { Pnrno: pnrno },
      1,
      `ADO.NET SqlCommand.ExecuteNonQuery() deleted booking ${pnrno}`
    );
  };

  // Raw SQL Execution Engine Simulator for SqlConsole (Admin Only)
  const handleExecuteRawSql = (sqlText: string): SqlQueryResult => {
    const startTime = performance.now();
    const cleanSql = sqlText.trim().replace(/;$/, '');
    const upper = cleanSql.toUpperCase();

    if (currentUser.role === 'viewer' && !upper.startsWith('SELECT')) {
      return {
        success: false,
        message: 'Permission Denied: Viewer role is restricted to SELECT queries only. Administrative privileges are required for write operations.',
        rowsAffected: 0,
        executionTimeMs: 0
      };
    }

    try {
      if (upper.startsWith('SELECT')) {
        let resultData = [...bookings];
        if (upper.includes('WHERE')) {
          const match = cleanSql.match(/WHERE\s+(.+)$/i);
          if (match && match[1]) {
            const condition = match[1].toLowerCase();
            resultData = resultData.filter((b) => {
              if (condition.includes('pnrno')) return b.pnrno.toLowerCase().includes(condition.replace(/[^a-z0-9]/gi, ''));
              if (condition.includes('trainname')) return b.trainName.toLowerCase().includes('vande') || b.trainName.toLowerCase().includes('express');
              return true;
            });
          }
        }

        const endTime = performance.now();
        addAdoLog('READ', '', cleanSql, {}, resultData.length, 'ADO.NET SqlDataAdapter.Fill(DataTable) completed.');

        return {
          success: true,
          message: `ADO.NET Query executed successfully. ${resultData.length} records retrieved into DataTable.`,
          rowsAffected: resultData.length,
          data: resultData,
          executionTimeMs: Math.round(endTime - startTime)
        };
      }

      if (upper.startsWith('INSERT')) {
        const pnrMatch = cleanSql.match(/VALUES\s*\(\s*'([^']+)'/i);
        const pnr = pnrMatch ? pnrMatch[1] : `PNR${Math.floor(10000000 + Math.random() * 90000000)}`;

        const newRow: TrainBooking = {
          pnrno: pnr,
          firstName: 'Karthik',
          lastName: 'Raja',
          seatNo: 'B3-18',
          trainName: 'Vande Bharat Express (20901)',
          travelDate: '2026-08-25',
          time: '06:00 AM',
          mobile: '9876501234',
          status: 'Confirmed',
          amount: 1450,
          classType: 'CC',
          createdAt: new Date().toISOString()
        };

        setBookings((prev) => [newRow, ...prev]);
        setActiveSceneBooking(newRow);
        const endTime = performance.now();

        addAdoLog('CREATE', pnr, cleanSql, newRow, 1, 'SqlCommand.ExecuteNonQuery() inserted 1 row.');

        return {
          success: true,
          message: `INSERT command executed successfully via ADO.NET. 1 row affected.`,
          rowsAffected: 1,
          executionTimeMs: Math.round(endTime - startTime)
        };
      }

      if (upper.startsWith('UPDATE')) {
        const endTime = performance.now();
        addAdoLog('UPDATE', '', cleanSql, {}, 1, 'SqlCommand.ExecuteNonQuery() updated 1 row.');

        return {
          success: true,
          message: `UPDATE command executed successfully. 1 row affected.`,
          rowsAffected: 1,
          executionTimeMs: Math.round(endTime - startTime)
        };
      }

      if (upper.startsWith('DELETE')) {
        const endTime = performance.now();
        if (bookings.length > 0) {
          const target = bookings[bookings.length - 1];
          setBookings((prev) => prev.slice(0, prev.length - 1));
          addAdoLog('DELETE', target.pnrno, cleanSql, { Pnrno: target.pnrno }, 1, 'SqlCommand.ExecuteNonQuery() deleted 1 row.');
        }

        return {
          success: true,
          message: `DELETE command executed successfully. 1 row affected.`,
          rowsAffected: 1,
          executionTimeMs: Math.round(endTime - startTime)
        };
      }

      return {
        success: true,
        message: 'SQL Command executed successfully.',
        rowsAffected: 0,
        executionTimeMs: Math.round(performance.now() - startTime)
      };
    } catch (err: any) {
      return {
        success: false,
        message: `SqlException: ${err.message || 'Syntax error in SQL statement.'}`,
        rowsAffected: 0,
        executionTimeMs: 0
      };
    }
  };

  // CSV Exporter
  const handleExportCsv = () => {
    const headers = ['Pnrno', 'First Name', 'Last Name', 'Seat No', 'Train Name', 'Travel Date', 'Time', 'Mobile', 'Status', 'Amount'];
    const rows = visibleBookings.map((b) => [
      b.pnrno,
      `"${b.firstName}"`,
      `"${b.lastName}"`,
      `"${b.seatNo}"`,
      `"${b.trainName}"`,
      b.travelDate,
      `"${b.time}"`,
      `"${b.mobile}"`,
      b.status,
      b.amount
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NLCI_Bookings_${currentUser.employeeName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. LOGIN PAGE (If stage explicit)
  if (appStage === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. TRAIN QUESTIONNAIRE SETUP WIZARD
  if (appStage === 'train_wizard') {
    return (
      <TrainQuestionnaireWizard
        user={currentUser}
        onSubmitAndLaunchScene={handleLaunchSceneFromWizard}
        onOpenSeatMap={(seat, cb) => {
          setSeatMapCurrentSeat(seat);
          setSeatMapCallback(() => cb);
          setIsSeatMapOpen(true);
        }}
        onSkipToDashboard={() => setAppStage('dashboard')}
      />
    );
  }

  // Theme Wrapper Mapping
  const themeCanvasClasses = {
    'dark-emerald': 'bg-[#121414] text-stone-100',
    'light-pearl': 'bg-[#f8fafc] text-slate-900',
    'navy-gold': 'bg-[#0b132b] text-amber-50',
    'forest-mint': 'bg-[#06140e] text-emerald-50'
  }[themeMode];

  return (
    <div className={`min-h-screen transition-colors duration-300 theme-${themeMode} ${themeCanvasClasses} font-sans antialiased flex flex-col`}>
      {/* Role-Aware Navigation Header */}
      <Header
        user={currentUser}
        themeMode={themeMode}
        onSelectTheme={(t) => setThemeMode(t)}
        onSelectPersona={handleSelectPersona}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenZipModal={() => setActiveTab('exam')}
        onOpenAskHr={() => setIsAskHrOpen(true)}
        onLogout={handleLogout}
        bookingCount={visibleBookings.length}
      />

      {/* Main Body View based on activeTab */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === 'portal' && (
          <div className="space-y-6">
            {/* View Mode Switcher Header Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPortalView('scene')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    portalView === 'scene'
                      ? 'bg-accent text-accent-foreground shadow-lg'
                      : 'text-stone-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🚂 {currentUser.role === 'admin' ? 'Train Main Scene Dashboard' : 'My e-Ticket Scene'}
                </button>
                <button
                  onClick={() => setPortalView('table')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    portalView === 'table'
                      ? 'bg-accent text-accent-foreground shadow-lg'
                      : 'text-stone-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  📊 {currentUser.role === 'admin' ? 'All User Database Records' : 'My Ticket History'} ({visibleBookings.length})
                </button>
              </div>

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setAppStage('train_wizard')}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/15 transition-colors"
                >
                  + Setup New Train Questionnaire
                </button>
              )}
            </div>

            {/* Portal View 1: Main Scene Dashboard for Selected Train */}
            {portalView === 'scene' && activeSceneBooking && (
              <TrainMainSceneDashboard
                booking={activeSceneBooking}
                user={currentUser}
                onEditBooking={(b) => {
                  if (currentUser.role === 'viewer') return;
                  setEditingBooking(b);
                  setIsBookingFormOpen(true);
                }}
                onDeleteBooking={handleDeleteBooking}
                onOpenSeatMap={(seat, cb) => {
                  setSeatMapCurrentSeat(seat);
                  setSeatMapCallback(() => cb);
                  setIsSeatMapOpen(true);
                }}
                onOpenTicketReceipt={(b) => setTicketReceiptBooking(b)}
                onEnterNewTrainDetails={() => setAppStage('train_wizard')}
                onGoToFullTable={() => setPortalView('table')}
              />
            )}

            {/* Portal View 2: Full Database Records Table */}
            {(portalView === 'table' || !activeSceneBooking) && (
              <BookingList
                bookings={visibleBookings}
                userRole={currentUser.role}
                onNewBooking={() => {
                  if (currentUser.role === 'viewer') return;
                  setEditingBooking(null);
                  setIsBookingFormOpen(true);
                }}
                onEditBooking={(b) => {
                  if (currentUser.role === 'viewer') return;
                  setEditingBooking(b);
                  setIsBookingFormOpen(true);
                }}
                onDeleteBooking={handleDeleteBooking}
                onViewTicket={(b) => {
                  setActiveSceneBooking(b);
                  setTicketReceiptBooking(b);
                }}
                onExportCsv={handleExportCsv}
              />
            )}
          </div>
        )}

        {/* Admin Only Views */}
        {currentUser.role === 'admin' && (
          <>
            {activeTab === 'code' && <CodeStudio />}

            {activeTab === 'sql' && (
              <SqlConsole
                bookings={bookings}
                userRole={currentUser.role}
                onExecuteQuery={handleExecuteRawSql}
              />
            )}

            {activeTab === 'exam' && (
              <CaseStudyExam
                timeRemaining={3600}
                isTimerRunning={false}
                onToggleTimer={() => {}}
                onResetTimer={() => {}}
                onOpenAskHr={() => setIsAskHrOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-white/10 py-4 text-center text-xs text-stone-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>NLCI Express Train Booking Management Portal</span>
          <span className="font-mono text-[11px] opacity-80">
            Active Role: <strong className="text-accent uppercase">{currentUser.role}</strong> ({currentUser.employeeName})
          </span>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      {currentUser.role === 'admin' && (
        <BookingForm
          isOpen={isBookingFormOpen}
          onClose={() => {
            setIsBookingFormOpen(false);
            setEditingBooking(null);
          }}
          onSubmit={handleSaveBooking}
          initialData={editingBooking}
          onOpenSeatMap={(seat, cb) => {
            setSeatMapCurrentSeat(seat);
            setSeatMapCallback(() => cb);
            setIsSeatMapOpen(true);
          }}
        />
      )}

      <SeatMapModal
        isOpen={isSeatMapOpen}
        onClose={() => setIsSeatMapOpen(false)}
        currentSeat={seatMapCurrentSeat}
        onSelectSeat={(seat) => {
          if (seatMapCallback) seatMapCallback(seat);
        }}
        trainName="NLCI Express Coach"
      />

      <TicketReceipt
        booking={ticketReceiptBooking}
        onClose={() => setTicketReceiptBooking(null)}
      />

      <AskHrModal
        isOpen={isAskHrOpen}
        onClose={() => setIsAskHrOpen(false)}
      />

      {/* ADO.NET Execution Toast Notifications */}
      <Toast logs={adoNetLogs} onDismiss={handleDismissLog} />
    </div>
  );
}
