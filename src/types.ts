export interface TrainBooking {
  pnrno: string;          // Pnrno - Primary Key e.g., PNR10928374
  firstName: string;      // First name
  lastName: string;       // Last name
  seatNo: string;         // seat no e.g. S3-42, B1-12
  trainName: string;      // Train name e.g. Vande Bharat Express (20901)
  travelDate: string;     // Travel date YYYY-MM-DD
  time: string;           // Time e.g. 06:15 AM
  mobile: string;         // Mobile e.g. +91 9876543210
  status: 'Confirmed' | 'RAC' | 'Waitlisted' | 'Cancelled';
  amount: number;         // Fare in INR
  classType: '1A' | '2A' | '3A' | 'SL' | 'CC' | 'EC';
  createdAt: string;
}

export interface SqlQueryResult {
  success: boolean;
  message: string;
  rowsAffected: number;
  data?: TrainBooking[];
  executionTimeMs: number;
  generatedSql?: string;
  adoNetMethod?: string;
}

export interface AdoNetLog {
  id: string;
  timestamp: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'RAW_SQL';
  pnrno?: string;
  sqlStatement: string;
  parameters: Record<string, any>;
  rowsAffected: number;
  status: 'SUCCESS' | 'ERROR';
  details: string;
}

export interface CaseStudyRubricItem {
  id: string;
  category: 'Database' | 'ADO.NET' | 'ASP.NET UI' | 'CRUD' | 'Security & Best Practices';
  title: string;
  description: string;
  weight: number; // percentage
  status: 'PASSED' | 'WARNING' | 'FAILED';
  evidence: string;
}

export interface AskHrTicket {
  id: string;
  portalId: string;
  employeeName: string;
  subject: string;
  queryType: 'Clarification' | 'Technical Issue' | 'Extension Request' | 'Portal Login';
  message: string;
  status: 'Submitted' | 'In Progress' | 'Resolved';
  timestamp: string;
  response?: string;
}

export type UserRole = 'admin' | 'viewer';

export type AppStage = 'login' | 'role_selection' | 'train_wizard' | 'dashboard';

export interface SavedPassengerDetails {
  pnrno?: string;
  firstName: string;
  lastName: string;
  seatNo: string;
  trainName: string;
  travelDate: string;
  time: string;
  mobile: string;
  rememberMe: boolean;
  lastUpdated?: string;
}

export interface UserProfile {
  username: string;
  employeeName: string;
  portalId: string;
  email: string;
  department: string;
  role: UserRole;
  avatarUrl?: string;
  loginTime: string;
}

export type ActiveTab = 'portal' | 'code' | 'sql' | 'exam';

export type ThemeMode = 'dark-emerald' | 'light-pearl' | 'navy-gold' | 'forest-mint';
