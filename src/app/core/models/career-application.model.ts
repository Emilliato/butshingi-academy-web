export type CareerApplicationStatus = 'submitted' | 'under-review' | 'shortlisted' | 'rejected' | 'hired';

export interface CareerApplication {
  id: string;
  referenceNumber: string;

  fullName: string;
  email: string;
  phone: string;
  positionAppliedFor: string;
  yearsOfExperience: string;
  coverLetter: string;

  cvFileName: string;
  cvUrl: string | null;

  status: CareerApplicationStatus;
  submittedAt: string; // ISO date
  reviewedAt: string | null;
  adminNotes: string;
}

export interface CareerApplicationDraft {
  fullName: string;
  email: string;
  phone: string;
  positionAppliedFor: string;
  yearsOfExperience: string;
  coverLetter: string;
  cvFile: File;
}
