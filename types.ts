export enum AppView {
  LANDING = 'LANDING',
  DIAGNOSTIC = 'DIAGNOSTIC',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  SCHEDULING = 'SCHEDULING',
  ADMIN = 'ADMIN',
  PMF_TEST = 'PMF_TEST'
}

export interface DiagnosticState {
  companyName: string;
  industry: string;
  businessModel: string;
  annualRevenue: string;
  employeeCount: string;
  primaryGoal: string;
  biggestChallenge: string;
  marketingChannel: string;
  cac: string;
  ltv: string; // New: Lifetime Value
  paybackPeriod: string; // New: Time to recover CAC
  techStackRating: number;
  salesCycleLength: string;
  customerRetention: number;
}

export interface AssessmentResult {
  overallScore: number;
  categoryScores: {
    strategy: number;
    execution: number;
    technology: number;
    team: number;
  };
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: {
    title: string;
    description: string;
    impact: 'High' | 'Medium' | 'Low';
  }[];
}

export interface BookingSlot {
  id: string;
  time: string; // e.g. "09:00 AM"
  date: string; // ISO String
  available: boolean;
}

export interface BookingRequest {
  name: string;
  email: string;
  companyName: string;
  slotId: string;
  date: string;
  time: string;
  notes?: string;
  diagnosticScore?: number;
  diagnosticSummary?: string;
  businessModel?: string; 
  annualRevenue?: string;
  employeeCount?: string;
}

export interface StoredLead extends BookingRequest {
  id: string;
  timestamp: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}