import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApplicationStatus, IntakeApplication, IntakeApplicationDraft } from '../models/application.model';

interface AdmissionDto {
  admissionId: number;
  referenceNumber: string;
  learnerFirstName: string;
  learnerLastName: string;
  learnerDob: string;
  learnerGender: string;
  gradeApplyingFor: string;
  homeLanguage: string;
  previousSchool: string | null;
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianEmail: string;
  homeAddress: string;
  hasSpecialNeeds: boolean;
  specialNeedsDetails: string | null;
  motivation: string;
  intakeYear: number;
  status: ApplicationStatus;
  adminNotes: string | null;
  submittedAt: string;
  reviewedAt: string | null;
}

interface PaginatedResponseDto<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

function toIntakeApplication(dto: AdmissionDto): IntakeApplication {
  return {
    id: String(dto.admissionId),
    referenceNumber: dto.referenceNumber,
    learnerFirstName: dto.learnerFirstName,
    learnerLastName: dto.learnerLastName,
    learnerDob: dto.learnerDob,
    learnerGender: dto.learnerGender as IntakeApplication['learnerGender'],
    gradeApplyingFor: dto.gradeApplyingFor,
    homeLanguage: dto.homeLanguage,
    previousSchool: dto.previousSchool ?? '',
    guardianName: dto.guardianName,
    guardianRelationship: dto.guardianRelationship,
    guardianPhone: dto.guardianPhone,
    guardianEmail: dto.guardianEmail,
    homeAddress: dto.homeAddress,
    hasSpecialNeeds: dto.hasSpecialNeeds,
    specialNeedsDetails: dto.specialNeedsDetails ?? '',
    motivation: dto.motivation,
    intakeYear: dto.intakeYear,
    status: dto.status,
    submittedAt: dto.submittedAt,
    reviewedAt: dto.reviewedAt,
    adminNotes: dto.adminNotes ?? '',
  };
}

/**
 * Talks to the EduFeesWeb API's /api/admissions endpoints. Public submission is
 * anonymous; listing, viewing and reviewing applications requires staff sign-in
 * (see AuthService), enforced server-side by the API's AdminOrDeveloper policy.
 */
@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admissions`;

  private readonly items = signal<IntakeApplication[]>([]);

  readonly all = computed(() => [...this.items()].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)));
  readonly pendingCount = computed(
    () => this.items().filter((a) => a.status === 'submitted' || a.status === 'under-review').length,
  );

  byId(id: string): IntakeApplication | undefined {
    return this.items().find((a) => a.id === id);
  }

  /** Loads (or reloads) the full application list from the API into local state. */
  loadAll(searchTerm = ''): Observable<IntakeApplication[]> {
    let params = new HttpParams().set('pageNumber', 1).set('pageSize', 500);
    if (searchTerm) params = params.set('searchTerm', searchTerm);

    return this.http.get<PaginatedResponseDto<AdmissionDto>>(this.baseUrl, { params }).pipe(
      map((res) => res.items.map(toIntakeApplication)),
      tap((list) => this.items.set(list)),
    );
  }

  /** Fetches a single application by id, refreshing it in local state (for deep links). */
  fetchById(id: string): Observable<IntakeApplication> {
    return this.http.get<AdmissionDto>(`${this.baseUrl}/${id}`).pipe(
      map(toIntakeApplication),
      tap((app) => this.upsert(app)),
    );
  }

  submit(draft: IntakeApplicationDraft): Observable<IntakeApplication> {
    return this.http.post<AdmissionDto>(this.baseUrl, draft).pipe(
      map(toIntakeApplication),
      tap((app) => this.upsert(app)),
    );
  }

  setStatus(id: string, status: ApplicationStatus, adminNotes?: string): Observable<IntakeApplication> {
    return this.http
      .put<AdmissionDto>(`${this.baseUrl}/${id}/status`, { status, adminNotes })
      .pipe(
        map(toIntakeApplication),
        tap((app) => this.upsert(app)),
      );
  }

  remove(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(tap(() => this.items.update((list) => list.filter((a) => a.id !== id))));
  }

  private upsert(app: IntakeApplication): void {
    this.items.update((list) => {
      const idx = list.findIndex((a) => a.id === app.id);
      if (idx === -1) return [app, ...list];
      const copy = [...list];
      copy[idx] = app;
      return copy;
    });
  }
}
