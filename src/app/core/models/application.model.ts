export type ApplicationStatus = 'submitted' | 'under-review' | 'accepted' | 'waitlisted' | 'declined';

export interface IntakeApplication {
  id: string;
  referenceNumber: string;

  // Learner details
  learnerFirstName: string;
  learnerLastName: string;
  learnerDob: string; // ISO date
  learnerGender: 'Female' | 'Male' | 'Prefer not to say';
  gradeApplyingFor: string;
  homeLanguage: string;
  previousSchool: string;

  // Guardian details
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianEmail: string;
  homeAddress: string;

  // Extra
  hasSpecialNeeds: boolean;
  specialNeedsDetails: string;
  motivation: string;
  intakeYear: number;

  status: ApplicationStatus;
  submittedAt: string; // ISO date
  reviewedAt: string | null;
  adminNotes: string;
}

export type IntakeApplicationDraft = Omit<
  IntakeApplication,
  'id' | 'referenceNumber' | 'status' | 'submittedAt' | 'reviewedAt' | 'adminNotes'
>;
