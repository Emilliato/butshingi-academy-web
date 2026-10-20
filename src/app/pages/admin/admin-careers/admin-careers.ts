import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CareerService } from '../../../core/services/career.service';
import { CareerApplicationStatus } from '../../../core/models/career-application.model';

@Component({
  selector: 'app-admin-careers',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './admin-careers.html',
  styleUrl: './admin-careers.scss',
})
export class AdminCareersComponent implements OnInit {
  careers = inject(CareerService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly statusFilter = signal<CareerApplicationStatus | 'all'>('all');
  readonly search = signal('');

  readonly statuses: (CareerApplicationStatus | 'all')[] = [
    'all', 'submitted', 'under-review', 'shortlisted', 'hired', 'rejected',
  ];

  readonly filtered = computed(() => {
    const status = this.statusFilter();
    const term = this.search().trim().toLowerCase();
    return this.careers.all().filter((a) => {
      const matchesStatus = status === 'all' || a.status === status;
      const matchesSearch =
        !term ||
        a.fullName.toLowerCase().includes(term) ||
        a.referenceNumber.toLowerCase().includes(term) ||
        a.positionAppliedFor.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set(null);
    this.careers.loadAll().subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load career applications from the server. Please try again.');
      },
    });
  }

  setStatus(status: CareerApplicationStatus | 'all'): void {
    this.statusFilter.set(status);
  }

  onSearch(value: string): void {
    this.search.set(value);
  }
}
