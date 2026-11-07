import { describe, it, expect } from 'vitest';
import { calculateSmartMatch } from '@/lib/matching';
import { Scholarship, StudentProfile } from '@/types';

const baseScholarship: Scholarship = {
  id: 'test-grant-1',
  name: 'National STEM Excellence Fellowship',
  provider: 'Department of Science',
  category: 'STEM & Tech',
  description: 'National fellowship for STEM students',
  awardAmount: 100000,
  awardType: 'Per Annum',
  deadline: '2026-12-31',
  educationLevels: ['Undergraduate', 'Postgraduate'],
  eligibleStreams: ['Engineering & Technology', 'Basic Sciences'],
  minAcademicScore: 75,
  maxFamilyIncome: 600000,
  eligibleStates: ['All India'],
  genderCriteria: 'All',
  requiredDocuments: ['Aadhaar Card', 'Marksheet'],
  applicationProcess: ['Submit online'],
  officialUrl: 'https://scholarships.gov.in',
  verifiedStatus: 'Verified Official',
  benefitsSummary: '1 Lakh per annum',
  contactInfo: 'help@nic.in',
  tags: ['STEM', 'National'],
};

const eligibleStudent: StudentProfile = {
  fullName: 'Aarav Sharma',
  email: 'aarav@example.edu.in',
  phone: '9876543210',
  educationLevel: 'Undergraduate',
  institution: 'National Institute of Technology',
  course: 'B.Tech Computer Science',
  stream: 'Engineering & Technology',
  academicScore: 85,
  academicScoreType: 'Percentage',
  familyIncome: 450000,
  state: 'Karnataka',
  gender: 'Male',
  category: 'General',
  isFirstGenerationLearner: false,
  hasDisability: false,
};

describe('Smart Match Engine (calculateSmartMatch)', () => {
  it('computes 100% score and High confidence tier when all criteria are satisfied', () => {
    const result = calculateSmartMatch(baseScholarship, eligibleStudent);
    expect(result.isEligible).toBe(true);
    expect(result.matchScore).toBe(100);
    expect(result.confidenceTier).toBe('High');
    expect(result.unmatchedCriteria.length).toBe(0);
    expect(result.missingInformation.length).toBe(0);
  });

  it('fails eligibility (score capped <= 48%) when education level does not match', () => {
    const highSchoolStudent: StudentProfile = {
      ...eligibleStudent,
      educationLevel: 'High School (11th-12th)',
    };
    const result = calculateSmartMatch(baseScholarship, highSchoolStudent);
    expect(result.isEligible).toBe(false);
    expect(result.matchScore).toBeLessThanOrEqual(48);
    expect(result.confidenceTier).toBe('Low');
    expect(result.unmatchedCriteria.some((c) => c.label === 'Education Level')).toBe(true);
  });

  it('fails eligibility (score capped <= 48%) when academic stream does not match', () => {
    const commerceStudent: StudentProfile = {
      ...eligibleStudent,
      stream: 'Commerce & Management',
    };
    const result = calculateSmartMatch(baseScholarship, commerceStudent);
    expect(result.isEligible).toBe(false);
    expect(result.matchScore).toBeLessThanOrEqual(48);
    expect(result.confidenceTier).toBe('Low');
    expect(
      result.unmatchedCriteria.some((c) => c.label === 'Academic Stream / Discipline')
    ).toBe(true);
  });

  it('enforces gender restrictions: female-only scholarship excludes male candidates', () => {
    const femaleScholarship: Scholarship = {
      ...baseScholarship,
      genderCriteria: 'Female Only',
    };
    const result = calculateSmartMatch(femaleScholarship, eligibleStudent);
    expect(result.isEligible).toBe(false);
    expect(result.matchScore).toBeLessThanOrEqual(48);
    expect(result.confidenceTier).toBe('Low');
    expect(result.unmatchedCriteria.some((c) => c.label === 'Gender Restriction')).toBe(true);

    const femaleStudent: StudentProfile = {
      ...eligibleStudent,
      gender: 'Female',
    };
    const passedResult = calculateSmartMatch(femaleScholarship, femaleStudent);
    expect(passedResult.isEligible).toBe(true);
    expect(passedResult.matchScore).toBe(100);
  });

  it('fails eligibility when student family income exceeds the scholarship ceiling', () => {
    const affluentStudent: StudentProfile = {
      ...eligibleStudent,
      familyIncome: 800000, // scholarship cap is 600000
    };
    const result = calculateSmartMatch(baseScholarship, affluentStudent);
    expect(result.isEligible).toBe(false);
    expect(result.matchScore).toBeLessThanOrEqual(48);
    expect(result.confidenceTier).toBe('Low');
    expect(result.unmatchedCriteria.some((c) => c.label === 'Family Income Ceiling')).toBe(true);
  });

  it('accepts any income bracket when scholarship has no income ceiling (maxFamilyIncome = 0)', () => {
    const meritOnlyScholarship: Scholarship = {
      ...baseScholarship,
      maxFamilyIncome: 0,
    };
    const affluentStudent: StudentProfile = {
      ...eligibleStudent,
      familyIncome: 2500000,
    };
    const result = calculateSmartMatch(meritOnlyScholarship, affluentStudent);
    expect(result.isEligible).toBe(true);
    expect(result.matchScore).toBe(100);
  });

  it('fails eligibility when student academic score is below minimum threshold', () => {
    const lowerScoringStudent: StudentProfile = {
      ...eligibleStudent,
      academicScore: 70, // scholarship minimum is 75
    };
    const result = calculateSmartMatch(baseScholarship, lowerScoringStudent);
    expect(result.isEligible).toBe(false);
    expect(result.matchScore).toBeLessThanOrEqual(48);
    expect(result.confidenceTier).toBe('Low');
    expect(result.unmatchedCriteria.some((c) => c.label === 'Minimum Academic Score')).toBe(true);
  });

  it('enforces state domicile requirements', () => {
    const karnatakaOnlyScholarship: Scholarship = {
      ...baseScholarship,
      eligibleStates: ['Karnataka'],
    };

    const karnatakaStudent: StudentProfile = {
      ...eligibleStudent,
      state: 'Karnataka',
    };
    expect(calculateSmartMatch(karnatakaOnlyScholarship, karnatakaStudent).isEligible).toBe(true);

    const maharashtraStudent: StudentProfile = {
      ...eligibleStudent,
      state: 'Maharashtra',
    };
    const stateFailedResult = calculateSmartMatch(karnatakaOnlyScholarship, maharashtraStudent);
    expect(stateFailedResult.isEligible).toBe(false);
    expect(stateFailedResult.matchScore).toBeLessThanOrEqual(48);
    expect(stateFailedResult.confidenceTier).toBe('Low');
  });

  it('tracks missing profile fields and flags them in missingInformation array', () => {
    const incompleteStudent: StudentProfile = {
      ...eligibleStudent,
      stream: '' as any,
      state: '',
    };
    const result = calculateSmartMatch(baseScholarship, incompleteStudent);
    expect(result.missingInformation.length).toBeGreaterThan(0);
    expect(
      result.missingInformation.some((m) => m.toLowerCase().includes('stream'))
    ).toBe(true);
  });
});
