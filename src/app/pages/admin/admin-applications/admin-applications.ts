import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApplicationService } from '../../../core/services/application.service';
import { ApplicationStatus } from '../../../core/models/application.model';

@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './admin-applications.html',
  styleUrl: './admin-applications.scss',
})
export class AdminApplicationsComponent implements OnInit {
  applications = inject(ApplicationService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly statusFilter = signal<ApplicationStatus | 'all'>('all');
  readonly search = signal('');

  readonly statuses: (ApplicationStatus | 'all')[] = [
    'all', 'submitted', 'under-review', 'accepted', 'waitlisted', 'declined',
  ];

  readonly filtered = computed(() => {
    const status = this.statusFilter();
    const term = this.search().trim().toLowerCase();
    return this.applications.all().filter((a) => {
      const matchesStatus = status === 'all' || a.status === status;
      const matchesSearch =
        !term ||
        `${a.learnerFirstName} ${a.learnerLastName}`.toLowerCase().includes(term) ||
        a.referenceNumber.toLowerCase().includes(term) ||
        a.guardianName.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set(null);
    this.applications.loadAll().subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load applications from the server. Please try again.');
      },
    });
  }

  setStatus(status: ApplicationStatus | 'all'): void {
    this.statusFilter.set(status);
  }

  onSearch(value: string): void {
    this.search.set(value);
  }
}
