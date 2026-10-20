import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CareerApplication,
  CareerApplicationDraft,
  CareerApplicationStatus,
} from '../models/career-application.model';

interface CareerDto {
  careerApplicationId: number;
  referenceNumber: string;
  fullName: string;
  email: string;
  phone: string;
  positionAppliedFor: string;
  yearsOfExperience: string | null;
  coverLetter: string;
  cvFileName: string;
  cvUrl: string | null;
  status: CareerApplicationStatus;
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

function toCareerApplication(dto: CareerDto): CareerApplication {
  return {
    id: String(dto.careerApplicationId),
    referenceNumber: dto.referenceNumber,
    fullName: dto.fullName,
    email: dto.email,
    phone: dto.phone,
    positionAppliedFor: dto.positionAppliedFor,
    yearsOfExperience: dto.yearsOfExperience ?? '',
    coverLetter: dto.coverLetter,
    cvFileName: dto.cvFileName,
    cvUrl: dto.cvUrl,
    status: dto.status,
    submittedAt: dto.submittedAt,
    reviewedAt: dto.reviewedAt,
    adminNotes: dto.adminNotes ?? '',
  };
}

/**
 * Talks to the EduFeesWeb API's /api/careers endpoints (mirrors ApplicationService's
 * shape for admissions). NOTE: as of this writing the EduFeesWeb backend does not yet
 * expose a /careers endpoint or CV file storage — this service is built ready to go,
 * but submissions will fail with a network/404 error until that backend work lands.
 */
@Injectable({ providedIn: 'root' })
export class CareerService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/careers`;

  private readonly items = signal<CareerApplication[]>([]);

  readonly all = computed(() => [...this.items()].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)));
  readonly pendingCount = computed(
    () => this.items().filter((a) => a.status === 'submitted' || a.status === 'under-review').length,
  );

  byId(id: string): CareerApplication | undefined {
    return this.items().find((a) => a.id === id);
  }

  loadAll(searchTerm = ''): Observable<CareerApplication[]> {
    let params = new HttpParams().set('pageNumber', 1).set('pageSize', 500);
    if (searchTerm) params = params.set('searchTerm', searchTerm);

    return this.http.get<PaginatedResponseDto<CareerDto>>(this.baseUrl, { params }).pipe(
      map((res) => res.items.map(toCareerApplication)),
      tap((list) => this.items.set(list)),
    );
  }

  fetchById(id: string): Observable<CareerApplication> {
    return this.http.get<CareerDto>(`${this.baseUrl}/${id}`).pipe(
      map(toCareerApplication),
      tap((app) => this.upsert(app)),
    );
  }

  submit(draft: CareerApplicationDraft): Observable<CareerApplication> {
    const formData = new FormData();
    formData.append('fullName', draft.fullName);
    formData.append('email', draft.email);
    formData.append('phone', draft.phone);
    formData.append('positionAppliedFor', draft.positionAppliedFor);
    formData.append('yearsOfExperience', draft.yearsOfExperience);
    formData.append('coverLetter', draft.coverLetter);
    formData.append('cvFile', draft.cvFile, draft.cvFile.name);

    return this.http.post<CareerDto>(this.baseUrl, formData).pipe(
      map(toCareerApplication),
      tap((app) => this.upsert(app)),
    );
  }

  setStatus(id: string, status: CareerApplicationStatus, adminNotes?: string): Observable<CareerApplication> {
    return this.http
      .put<CareerDto>(`${this.baseUrl}/${id}/status`, { status, adminNotes })
      .pipe(
        map(toCareerApplication),
        tap((app) => this.upsert(app)),
      );
  }

  remove(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(tap(() => this.items.update((list) => list.filter((a) => a.id !== id))));
  }

  private upsert(app: CareerApplication): void {
    this.items.update((list) => {
      const idx = list.findIndex((a) => a.id === app.id);
      if (idx === -1) return [app, ...list];
      const copy = [...list];
      copy[idx] = app;
      return copy;
    });
  }
}
