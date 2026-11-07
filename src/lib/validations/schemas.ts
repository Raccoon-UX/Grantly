import { z } from 'zod';

export const EducationLevelEnum = z.enum([
  'High School (11th-12th)',
  'Undergraduate',
  'Postgraduate',
  'Diploma / Polytechnic',
  'PhD / Doctoral',
]);

export const AcademicStreamEnum = z.enum([
  'Engineering & Technology',
  'Medicine & Healthcare',
  'Basic Sciences',
  'Commerce & Management',
  'Humanities & Social Sciences',
  'Law',
  'Design & Arts',
]);

export const ScholarshipCategoryEnum = z.enum([
  'Merit-Based',
  'Need-Based',
  'STEM & Tech',
  'Women in Tech',
  'Minority / Reserved',
  'Special Talent',
  'Higher Education',
]);

export const AwardTypeEnum = z.enum([
  'Fixed Grant',
  'Per Annum',
  'Tuition Coverage',
  'One-time Stipend',
  'Monthly Fellowship',
]);

export const ApplicationStatusEnum = z.enum([
  'Saved',
  'Preparing',
  'Ready to Apply',
  'Applied',
  'Under Review',
  'Approved',
  'Rejected',
]);

export const ScholarshipSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  provider: z.string().min(1),
  category: ScholarshipCategoryEnum,
  description: z.string(),
  awardAmount: z.number().nonnegative(),
  awardType: AwardTypeEnum,
  deadline: z.string(),
  educationLevels: z.array(EducationLevelEnum),
  eligibleStreams: z.array(AcademicStreamEnum),
  minAcademicScore: z.number().min(0).max(100),
  maxFamilyIncome: z.number().nonnegative(),
  eligibleStates: z.array(z.string()),
  genderCriteria: z.enum(['All', 'Female Only', 'Male Only', 'Transgender / Non-binary']),
  requiredDocuments: z.array(z.string()),
  applicationProcess: z.array(z.string()),
  officialUrl: z.string().nullable(),
  verifiedStatus: z.enum(['Verified Official', 'Demo Partner']),
  benefitsSummary: z.string(),
  contactInfo: z.string(),
  tags: z.array(z.string()),
  featured: z.boolean().optional(),
});

export const StudentProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().default(''),
  avatarUrl: z.string().optional(),
  educationLevel: EducationLevelEnum,
  institution: z.string().min(1, 'Institution is required'),
  course: z.string().min(1, 'Course is required'),
  stream: AcademicStreamEnum,
  academicScore: z.number().min(0).max(100),
  academicScoreType: z.enum(['Percentage', 'CGPA']),
  familyIncome: z.number().nonnegative(),
  state: z.string().min(1),
  gender: z.enum(['Female', 'Male', 'Non-binary', 'Prefer not to say']),
  category: z.enum(['General', 'OBC', 'SC', 'ST', 'EWS']),
  isFirstGenerationLearner: z.boolean(),
  hasDisability: z.boolean(),
  bio: z.string().optional(),
});

export const DocumentItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  category: z.enum(['Identity', 'Academic', 'Financial', 'Institutional']),
  status: z.enum(['ready', 'pending', 'expiring']),
  fileName: z.string().optional(),
  fileSize: z.string().optional(),
  lastUpdated: z.string(),
  requiredForCount: z.number().int().nonnegative(),
});

export const ApplicationRecordSchema = z.object({
  id: z.string(),
  scholarshipId: z.string(),
  status: ApplicationStatusEnum,
  progressPercent: z.number().min(0).max(100),
  appliedDate: z.string().optional(),
  lastUpdated: z.string(),
  notes: z.string().default(''),
  documentsAttached: z.array(z.string()),
  reminderSet: z.boolean().optional(),
});

export const SavedIdsSchema = z.array(z.string());

/**
 * Validates and safely parses unknown data against a Zod schema.
 * If validation fails, logs a warning and returns the fallback default value.
 */
export function validateStorageData<T>(schema: z.ZodType<T>, data: unknown, fallback: T): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[StorageValidation] Zod validation failed for data; using safe default fallback.', result.error.format());
    }
    return fallback;
  }
  return result.data;
}
