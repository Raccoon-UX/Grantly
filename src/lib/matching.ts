import {
  Scholarship,
  StudentProfile,
  SmartMatchResult,
  CriterionCheck,
} from '@/types';

/**
 * Calculates deterministic smart match between a student profile and a scholarship.
 * Evaluates mandatory eligibility requirements (e.g. gender restrictions, education level,
 * stream, minimum academic score, income caps, state residence) and returns a granular breakdown.
 */
export function calculateSmartMatch(
  scholarship: Scholarship,
  profile: StudentProfile
): SmartMatchResult {
  const matchedCriteria: CriterionCheck[] = [];
  const unmatchedCriteria: CriterionCheck[] = [];
  const missingInformation: string[] = [];

  // Track weight for score computation
  let totalPossibleWeight = 0;
  let earnedWeight = 0;
  let hasFailedMandatory = false;

  // 1. Education Level (Mandatory, Weight 25)
  totalPossibleWeight += 25;
  if (!profile.educationLevel) {
    missingInformation.push('Education level not specified in profile');
  } else {
    const isLevelMatch = scholarship.educationLevels.includes(profile.educationLevel);
    const check: CriterionCheck = {
      label: 'Education Level',
      requiredValue: scholarship.educationLevels.join(', '),
      studentValue: profile.educationLevel,
      passed: isLevelMatch,
      weight: 25,
      importance: 'Mandatory',
    };
    if (isLevelMatch) {
      matchedCriteria.push(check);
      earnedWeight += 25;
    } else {
      unmatchedCriteria.push(check);
      hasFailedMandatory = true;
    }
  }

  // 2. Academic Stream (Mandatory, Weight 25)
  totalPossibleWeight += 25;
  if (!profile.stream) {
    missingInformation.push('Academic stream/discipline not set');
  } else {
    const isStreamMatch = scholarship.eligibleStreams.includes(profile.stream);
    const check: CriterionCheck = {
      label: 'Academic Stream / Discipline',
      requiredValue: scholarship.eligibleStreams.join(', '),
      studentValue: profile.stream,
      passed: isStreamMatch,
      weight: 25,
      importance: 'Mandatory',
    };
    if (isStreamMatch) {
      matchedCriteria.push(check);
      earnedWeight += 25;
    } else {
      unmatchedCriteria.push(check);
      hasFailedMandatory = true;
    }
  }

  // 3. Gender Requirement (Mandatory, Weight 15)
  totalPossibleWeight += 15;
  if (scholarship.genderCriteria === 'All') {
    matchedCriteria.push({
      label: 'Gender Eligibility',
      requiredValue: 'Open to all genders',
      studentValue: profile.gender || 'Not specified',
      passed: true,
      weight: 15,
      importance: 'Mandatory',
    });
    earnedWeight += 15;
  } else if (scholarship.genderCriteria === 'Female Only') {
    const passed = profile.gender === 'Female';
    const check: CriterionCheck = {
      label: 'Gender Restriction',
      requiredValue: 'Female candidates only',
      studentValue: profile.gender,
      passed,
      weight: 15,
      importance: 'Mandatory',
    };
    if (passed) {
      matchedCriteria.push(check);
      earnedWeight += 15;
    } else {
      unmatchedCriteria.push(check);
      hasFailedMandatory = true;
    }
  } else if (scholarship.genderCriteria === 'Male Only') {
    const passed = profile.gender === 'Male';
    const check: CriterionCheck = {
      label: 'Gender Restriction',
      requiredValue: 'Male candidates only',
      studentValue: profile.gender,
      passed,
      weight: 15,
      importance: 'Mandatory',
    };
    if (passed) {
      matchedCriteria.push(check);
      earnedWeight += 15;
    } else {
      unmatchedCriteria.push(check);
      hasFailedMandatory = true;
    }
  } else {
    // Transgender / Non-binary criteria
    const passed = profile.gender === 'Non-binary';
    const check: CriterionCheck = {
      label: 'Gender Restriction',
      requiredValue: scholarship.genderCriteria,
      studentValue: profile.gender,
      passed,
      weight: 15,
      importance: 'Mandatory',
    };
    if (passed) {
      matchedCriteria.push(check);
      earnedWeight += 15;
    } else {
      unmatchedCriteria.push(check);
      hasFailedMandatory = true;
    }
  }

  // 4. Academic Score / Merit (Weight 20)
  totalPossibleWeight += 20;
  if (typeof profile.academicScore !== 'number' || isNaN(profile.academicScore)) {
    missingInformation.push('Academic score / percentage is missing');
  } else {
    const scorePassed = profile.academicScore >= scholarship.minAcademicScore;
    const check: CriterionCheck = {
      label: 'Minimum Academic Score',
      requiredValue: `Min. ${scholarship.minAcademicScore}%`,
      studentValue: `${profile.academicScore}% (${profile.academicScoreType})`,
      passed: scorePassed,
      weight: 20,
      importance: 'Mandatory',
    };
    if (scorePassed) {
      matchedCriteria.push(check);
      earnedWeight += 20;
    } else {
      unmatchedCriteria.push(check);
      hasFailedMandatory = true;
    }
  }

  // 5. Family Income Cap (Weight 15)
  totalPossibleWeight += 15;
  if (scholarship.maxFamilyIncome === 0) {
    matchedCriteria.push({
      label: 'Family Income Criteria',
      requiredValue: 'No income ceiling (Open to all brackets)',
      studentValue: `₹${(profile.familyIncome || 0).toLocaleString('en-IN')}/year`,
      passed: true,
      weight: 15,
      importance: 'Mandatory',
    });
    earnedWeight += 15;
  } else {
    if (typeof profile.familyIncome !== 'number') {
      missingInformation.push('Annual family income not specified');
    } else {
      const incomePassed = profile.familyIncome <= scholarship.maxFamilyIncome;
      const check: CriterionCheck = {
        label: 'Family Income Ceiling',
        requiredValue: `Max ₹${scholarship.maxFamilyIncome.toLocaleString('en-IN')}/year`,
        studentValue: `₹${profile.familyIncome.toLocaleString('en-IN')}/year`,
        passed: incomePassed,
        weight: 15,
        importance: 'Mandatory',
      };
      if (incomePassed) {
        matchedCriteria.push(check);
        earnedWeight += 15;
      } else {
        unmatchedCriteria.push(check);
        hasFailedMandatory = true;
      }
    }
  }

  // 6. Domicile / State (Weight 10 bonus/constraint)
  if (!scholarship.eligibleStates.includes('All India')) {
    totalPossibleWeight += 10;
    if (!profile.state) {
      missingInformation.push('State domicile information missing');
    } else {
      const statePassed = scholarship.eligibleStates.includes(profile.state);
      const check: CriterionCheck = {
        label: 'State Domicile / Residency',
        requiredValue: scholarship.eligibleStates.join(', '),
        studentValue: profile.state,
        passed: statePassed,
        weight: 10,
        importance: 'Mandatory',
      };
      if (statePassed) {
        matchedCriteria.push(check);
        earnedWeight += 10;
      } else {
        unmatchedCriteria.push(check);
        hasFailedMandatory = true;
      }
    }
  }

  // Raw score percentage
  let rawScore = Math.round((earnedWeight / totalPossibleWeight) * 100);

  // If a mandatory criterion failed, cap match score to reflect preliminary mismatch
  if (hasFailedMandatory) {
    rawScore = Math.min(rawScore, 48);
  }

  // Deduct slightly for missing information
  if (missingInformation.length > 0) {
    rawScore = Math.max(0, rawScore - missingInformation.length * 8);
  }

  const isEligible = !hasFailedMandatory && missingInformation.length === 0 && rawScore >= 70;

  // Confidence Tier
  let confidenceTier: 'High' | 'Moderate' | 'Low' = 'Low';
  if (missingInformation.length === 0 && rawScore >= 80) {
    confidenceTier = 'High';
  } else if (rawScore >= 50) {
    confidenceTier = 'Moderate';
  }

  // Explanation generator
  let explanation = '';
  if (isEligible) {
    explanation = `Strong match (${rawScore}%). Your ${profile.educationLevel} status, ${profile.stream} background, ${profile.academicScore}% academic score, and income of ₹${profile.familyIncome.toLocaleString('en-IN')} fully satisfy the provider's criteria.`;
  } else if (hasFailedMandatory) {
    const failedLabels = unmatchedCriteria.map((c) => c.label).join(', ');
    explanation = `Preliminary mismatch (${rawScore}%). The following criteria do not match: ${failedLabels}.`;
  } else if (missingInformation.length > 0) {
    explanation = `Partial match (${rawScore}%). Complete your profile details (${missingInformation.join(', ')}) to verify full eligibility.`;
  } else {
    explanation = `Moderate match (${rawScore}%). Meets some criteria, but does not achieve high alignment with the selection mandate.`;
  }

  return {
    scholarshipId: scholarship.id,
    matchScore: Math.min(100, Math.max(0, rawScore)),
    isEligible,
    matchedCriteria,
    unmatchedCriteria,
    missingInformation,
    explanation,
    confidenceTier,
  };
}
