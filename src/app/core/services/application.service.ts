import { Injectable, computed, inject, signal } from '@angular/core';
import { IntakeApplication, IntakeApplicationDraft, ApplicationStatus } from '../models/application.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'butshingi.applications.v1';

function makeReference(intakeYear: number, seq: number): string {
  return `SBA-${intakeYear}-${String(seq).padStart(4, '0')}`;
}

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private storage = inject(StorageService);

  private readonly items = signal<IntakeApplication[]>(
    this.storage.read<IntakeApplication[]>(STORAGE_KEY, []),
  );

  readonly all = computed(() => [...this.items()].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)));
  readonly pendingCount = computed(
    () => this.items().filter((a) => a.status === 'submitted' || a.status === 'under-review').length,
  );

  byId(id: string): IntakeApplication | undefined {
    return this.items().find((a) => a.id === id);
  }

  submit(draft: IntakeApplicationDraft): IntakeApplication {
    const seq = this.items().filter((a) => a.intakeYear === draft.intakeYear).length + 1;
    const now = new Date().toISOString();
    const application: IntakeApplication = {
      ...draft,
      id: crypto.randomUUID(),
      referenceNumber: makeReference(draft.intakeYear, seq),
      status: 'submitted',
      submittedAt: now,
      reviewedAt: null,
      adminNotes: '',
    };
    this.items.update((list) => [application, ...list]);
    this.persist();
    return application;
  }

  setStatus(id: string, status: ApplicationStatus, adminNotes?: string): void {
    this.items.update((list) =>
      list.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              reviewedAt: new Date().toISOString(),
              adminNotes: adminNotes ?? a.adminNotes,
            }
          : a,
      ),
    );
    this.persist();
  }

  remove(id: string): void {
    this.items.update((list) => list.filter((a) => a.id !== id));
    this.persist();
  }

  private persist(): void {
    this.storage.write(STORAGE_KEY, this.items());
  }
}
