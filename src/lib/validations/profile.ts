import { z } from 'zod';
import {
  StudentProfileSchema,
  EducationLevelEnum,
  AcademicStreamEnum,
} from './schemas';
import { StudentProfile } from '@/types';

export const ProfileFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  email: z
    .string()
    .trim()
    .email('Valid academic or personal email address is required'),
  phone: z.string().trim().default(''),
  avatarUrl: z.string().optional(),
  educationLevel: EducationLevelEnum,
  institution: z
    .string()
    .trim()
    .min(2, 'Institution name must be at least 2 characters'),
  course: z
    .string()
    .trim()
    .min(2, 'Degree & specialization must be at least 2 characters'),
  stream: AcademicStreamEnum,
  academicScore: z
    .number()
    .min(0, 'Academic score cannot be negative')
    .max(100, 'Academic score cannot exceed 100%'),
  academicScoreType: z.enum(['Percentage', 'CGPA']),
  familyIncome: z
    .number()
    .min(0, 'Annual family income must be 0 or positive'),
  state: z.string().trim().min(1, 'State of domicile is required'),
  gender: z.enum(['Female', 'Male', 'Non-binary', 'Prefer not to say']),
  category: z.enum(['General', 'OBC', 'SC', 'ST', 'EWS']),
  isFirstGenerationLearner: z.boolean(),
  hasDisability: z.boolean(),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
});

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

export interface ProfileValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  errorList: string[];
  validatedData?: StudentProfile;
}

export function validateProfileForm(data: unknown): ProfileValidationResult {
  const result = ProfileFormSchema.safeParse(data);

  if (result.success) {
    return {
      isValid: true,
      errors: {},
      errorList: [],
      validatedData: result.data as StudentProfile,
    };
  }

  const errors: Record<string, string> = {};
  const errorList: string[] = [];

  for (const issue of result.error.issues) {
    const field = issue.path[0] ? String(issue.path[0]) : 'form';
    if (!errors[field]) {
      errors[field] = issue.message;
      errorList.push(issue.message);
    }
  }

  return {
    isValid: false,
    errors,
    errorList,
  };
}
