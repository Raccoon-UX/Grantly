export type EducationLevel =
  | 'High School (11th-12th)'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'Diploma / Polytechnic'
  | 'PhD / Doctoral';

export type AcademicStream =
  | 'Engineering & Technology'
  | 'Medicine & Healthcare'
  | 'Basic Sciences'
  | 'Commerce & Management'
  | 'Humanities & Social Sciences'
  | 'Law'
  | 'Design & Arts';

export type ScholarshipCategory =
  | 'Merit-Based'
  | 'Need-Based'
  | 'STEM & Tech'
  | 'Women in Tech'
  | 'Minority / Reserved'
  | 'Special Talent'
  | 'Higher Education';

export type AwardType =
  | 'Fixed Grant'
  | 'Per Annum'
  | 'Tuition Coverage'
  | 'One-time Stipend'
  | 'Monthly Fellowship';

export type ApplicationStatus =
  | 'Saved'
  | 'Preparing'
  | 'Ready to Apply'
  | 'Applied'
  | 'Under Review'
  | 'Approved'
  | 'Rejected';

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  category: ScholarshipCategory;
  description: string;
  awardAmount: number;
  awardType: AwardType;
  deadline: string; // ISO date YYYY-MM-DD
  educationLevels: EducationLevel[];
  eligibleStreams: AcademicStream[];
  minAcademicScore: number; // in percentage (e.g. 75)
  maxFamilyIncome: number; // in INR per annum (e.g. 600000). 0 means no income cap.
  eligibleStates: string[]; // ["All India"] or specific states
  genderCriteria: 'All' | 'Female Only' | 'Male Only' | 'Transgender / Non-binary';
  requiredDocuments: string[];
  applicationProcess: string[];
  officialUrl: string | null;
  verifiedStatus: 'Verified Official' | 'Demo Partner';
  benefitsSummary: string;
  contactInfo: string;
  tags: string[];
  featured?: boolean;
}

export interface StudentProfile {
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  educationLevel: EducationLevel;
  institution: string;
  course: string;
  stream: AcademicStream;
  academicScore: number; // percentage
  academicScoreType: 'Percentage' | 'CGPA';
  familyIncome: number; // INR per annum
  state: string;
  gender: 'Female' | 'Male' | 'Non-binary' | 'Prefer not to say';
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  isFirstGenerationLearner: boolean;
  hasDisability: boolean;
  bio?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Identity' | 'Academic' | 'Financial' | 'Institutional';
  status: 'ready' | 'pending' | 'expiring';
  fileName?: string;
  fileSize?: string;
  lastUpdated: string;
  requiredForCount: number;
}

export interface CriterionCheck {
  label: string;
  requiredValue: string;
  studentValue: string;
  passed: boolean;
  weight: number;
  importance: 'Mandatory' | 'Preferred';
}

export interface SmartMatchResult {
  scholarshipId: string;
  matchScore: number; // 0-100
  isEligible: boolean;
  matchedCriteria: CriterionCheck[];
  unmatchedCriteria: CriterionCheck[];
  missingInformation: string[];
  explanation: string;
  confidenceTier: 'High' | 'Moderate' | 'Low';
}

export interface ApplicationRecord {
  id: string;
  scholarshipId: string;
  status: ApplicationStatus;
  progressPercent: number;
  appliedDate?: string;
  lastUpdated: string;
  notes: string;
  documentsAttached: string[];
  reminderSet?: boolean;
}

export interface FilterState {
  searchQuery: string;
  educationLevel: string;
  academicStream: string;
  minAmount: number;
  maxAmount: number;
  location: string;
  incomeLimit: number; // max income limit
  category: string;
  deadlineRange: string; // 'all' | '7days' | '30days' | '60days'
  sortBy: 'relevance' | 'amount-high' | 'amount-low' | 'deadline-soon' | 'match-score';
}
