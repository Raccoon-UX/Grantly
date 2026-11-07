'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useGrantly } from '@/context/GrantlyContext';
import { StudentProfile, EducationLevel, AcademicStream } from '@/types';
import { validateProfileForm } from '@/lib/validations/profile';
import {
  User,
  GraduationCap,
  Building2,
  Briefcase,
  IndianRupee,
  MapPin,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function ProfilePage() {
  const { profile, updateProfile, stats } = useGrantly();

  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formFeedback, setFormFeedback] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const educationLevels: EducationLevel[] = [
    'Undergraduate',
    'Postgraduate',
    'Diploma / Polytechnic',
    'High School (11th-12th)',
    'PhD / Doctoral',
  ];

  const academicStreams: AcademicStream[] = [
    'Engineering & Technology',
    'Medicine & Healthcare',
    'Basic Sciences',
    'Commerce & Management',
    'Humanities & Social Sciences',
    'Law',
    'Design & Arts',
  ];

  const states = [
    'Karnataka',
    'Maharashtra',
    'Tamil Nadu',
    'Delhi NCR',
    'Uttar Pradesh',
    'West Bengal',
    'Telangana',
    'Gujarat',
    'Kerala',
    'Other State',
  ];

  const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateProfileForm(formData);

    if (!result.isValid) {
      setErrors(result.errors);
      setSaveSuccess(false);
      setFormFeedback(
        `Please resolve ${result.errorList.length} required field issue${
          result.errorList.length > 1 ? 's' : ''
        } in your profile before saving.`
      );
      return;
    }

    setErrors({});
    setFormFeedback('');
    updateProfile(result.validatedData || formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#EDEBFF] text-[#5145CD] flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17213A] tracking-tight">
                Student Profile
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Your academic credentials and socio-economic parameters power the Smart Match algorithm.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-2xl border border-[#E7E9F0] shadow-card flex items-center gap-2">
              <span className="text-xs font-semibold text-[#667085]">Completeness:</span>
              <span className="text-sm font-extrabold text-[#5145CD] tabular-nums">
                {stats.profileCompletionPercent}%
              </span>
            </div>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-[#16A779] flex-shrink-0" />
            <span className="font-semibold">
              Profile updated successfully! Smart Match engine has recalculated all scholarship alignments.
            </span>
          </div>
        )}

        {formFeedback && (
          <div
            role="alert"
            aria-live="assertive"
            className="p-4 rounded-2xl bg-red-50 border border-red-200 text-[#DC5260] text-xs sm:text-sm flex items-center gap-2 animate-in fade-in duration-200"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#DC5260]" />
            <span className="font-semibold">{formFeedback}</span>
          </div>
        )}

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Personal Credentials */}
          <div className="bg-white rounded-3xl border border-[#E7E9F0] p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E7E9F0] pb-3">
              <User className="w-4 h-4 text-[#5145CD]" />
              <h2 className="text-sm font-bold text-[#17213A]">1. Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="profile-fullName" className="text-xs font-bold text-[#17213A]">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="profile-fullName"
                  type="text"
                  value={formData.fullName}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? 'error-fullName' : undefined}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="mt-1 w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A] focus:border-[#5145CD]"
                />
                {errors.fullName && (
                  <p id="error-fullName" className="text-[10px] text-red-500 mt-0.5">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="profile-email" className="text-xs font-bold text-[#17213A]">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={formData.email}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'error-email' : undefined}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A] focus:border-[#5145CD]"
                />
                {errors.email && (
                  <p id="error-email" className="text-[10px] text-red-500 mt-0.5">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="profile-phone" className="text-xs font-bold text-[#17213A]">
                  Phone Number
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A] focus:border-[#5145CD]"
                />
              </div>

              <div>
                <label htmlFor="profile-gender" className="text-xs font-bold text-[#17213A]">
                  Gender Mandate Group
                </label>
                <select
                  id="profile-gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value as 'Female' | 'Male' | 'Non-binary' | 'Prefer not to say',
                    })
                  }
                  className="mt-1 w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A] focus:border-[#5145CD]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Academic Profile */}
          <div className="bg-white rounded-3xl border border-[#E7E9F0] p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E7E9F0] pb-3">
              <GraduationCap className="w-4 h-4 text-[#5145CD]" />
              <h2 className="text-sm font-bold text-[#17213A]">2. Academic Enrollment & Merit</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="profile-eduLevel" className="text-xs font-bold text-[#17213A]">
                  Education Level <span className="text-red-500">*</span>
                </label>
                <select
                  id="profile-eduLevel"
                  value={formData.educationLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, educationLevel: e.target.value as EducationLevel })
                  }
                  className="mt-1 w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A] focus:border-[#5145CD]"
                >
                  {educationLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="profile-stream" className="text-xs font-bold text-[#17213A]">
                  Academic Stream / Discipline <span className="text-red-500">*</span>
                </label>
                <select
                  id="profile-stream"
                  value={formData.stream}
                  onChange={(e) =>
                    setFormData({ ...formData, stream: e.target.value as AcademicStream })
                  }
                  className="mt-1 w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A] focus:border-[#5145CD]"
                >
                  {academicStreams.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="profile-institution" className="text-xs font-bold text-[#17213A]">
                  Institution / University <span className="text-red-500">*</span>
                </label>
                <input
                  id="profile-institution"
                  type="text"
                  value={formData.institution}
                  aria-invalid={!!errors.institution}
                  aria-describedby={errors.institution ? 'error-institution' : undefined}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="mt-1 w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A] focus:border-[#5145CD]"
                />
                {errors.institution && (
                  <p id="error-institution" className="text-[10px] text-red-500 mt-0.5">
                    {errors.institution}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="profile-course" className="text-xs font-bold text-[#17213A]">
                  Degree & Specialization <span className="text-red-500">*</span>
                </label>
                <input
                  id="profile-course"
                  type="text"
                  value={formData.course}
                  aria-invalid={!!errors.course}
                  aria-describedby={errors.course ? 'error-course' : undefined}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="mt-1 w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A] focus:border-[#5145CD]"
                />
                {errors.course && (
                  <p id="error-course" className="text-[10px] text-red-500 mt-0.5">
                    {errors.course}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="profile-academicScore" className="text-xs font-bold text-[#17213A]">
                  Academic Score (%) <span className="text-red-500">*</span>
                </label>
                <input
                  id="profile-academicScore"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.academicScore}
                  aria-invalid={!!errors.academicScore}
                  aria-describedby={errors.academicScore ? 'error-score' : undefined}
                  onChange={(e) =>
                    setFormData({ ...formData, academicScore: parseFloat(e.target.value) || 0 })
                  }
                  className="mt-1 w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A] focus:border-[#5145CD]"
                />
                {errors.academicScore && (
                  <p id="error-score" className="text-[10px] text-red-500 mt-0.5">
                    {errors.academicScore}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="profile-scoreType" className="text-xs font-bold text-[#17213A]">
                  Score Type
                </label>
                <select
                  id="profile-scoreType"
                  value={formData.academicScoreType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      academicScoreType: e.target.value as 'Percentage' | 'CGPA',
                    })
                  }
                  className="mt-1 w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A] focus:border-[#5145CD]"
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="CGPA">CGPA (Converted to 100 Scale)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Socio-Economic & Domicile Criteria */}
          <div className="bg-white rounded-3xl border border-[#E7E9F0] p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E7E9F0] pb-3">
              <IndianRupee className="w-4 h-4 text-[#5145CD]" />
              <h2 className="text-sm font-bold text-[#17213A]">
                3. Financial & Affirmative Eligibility
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="profile-income" className="text-xs font-bold text-[#17213A]">
                  Annual Family Income (INR) <span className="text-red-500">*</span>
                </label>
                <input
                  id="profile-income"
                  type="number"
                  step="10000"
                  min="0"
                  value={formData.familyIncome}
                  aria-invalid={!!errors.familyIncome}
                  aria-describedby={errors.familyIncome ? 'error-income' : undefined}
                  onChange={(e) =>
                    setFormData({ ...formData, familyIncome: parseInt(e.target.value, 10) || 0 })
                  }
                  className="mt-1 w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A] focus:border-[#5145CD]"
                />
                <p className="text-[10px] text-[#667085] mt-1">
                  Current: ₹{formData.familyIncome.toLocaleString('en-IN')} per annum
                </p>
                {errors.familyIncome && (
                  <p id="error-income" className="text-[10px] text-red-500 mt-0.5">
                    {errors.familyIncome}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="profile-state" className="text-xs font-bold text-[#17213A]">
                  State of Domicile <span className="text-red-500">*</span>
                </label>
                <select
                  id="profile-state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="mt-1 w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A] focus:border-[#5145CD]"
                >
                  {states.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="profile-category" className="text-xs font-bold text-[#17213A]">
                  Social Category
                </label>
                <select
                  id="profile-category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as 'General' | 'OBC' | 'SC' | 'ST' | 'EWS',
                    })
                  }
                  className="mt-1 w-full bg-[#F7F8FC] border border-[#E7E9F0] rounded-xl px-3 py-2 text-xs font-medium text-[#17213A] focus:border-[#5145CD]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 pt-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#17213A]">
                  <input
                    type="checkbox"
                    checked={formData.isFirstGenerationLearner}
                    onChange={(e) =>
                      setFormData({ ...formData, isFirstGenerationLearner: e.target.checked })
                    }
                    className="rounded text-[#5145CD] focus:ring-[#5145CD]"
                  />
                  <span>First Generation College Learner in Family</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#17213A]">
                  <input
                    type="checkbox"
                    checked={formData.hasDisability}
                    onChange={(e) => setFormData({ ...formData, hasDisability: e.target.checked })}
                    className="rounded text-[#5145CD] focus:ring-[#5145CD]"
                  />
                  <span>Person with Benchmark Disability (PwD)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setFormData(profile)}
              className="px-4 py-2.5 rounded-xl border border-[#E7E9F0] text-xs font-semibold text-[#667085] hover:bg-white"
            >
              Discard Changes
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#5145CD] hover:bg-[#4338B8] text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Recalculate Matches</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
