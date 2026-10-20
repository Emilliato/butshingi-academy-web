import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CareerService } from '../../../core/services/career.service';
import { CareerApplication, CareerApplicationStatus } from '../../../core/models/career-application.model';

@Component({
  selector: 'app-admin-career-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './admin-career-detail.html',
  styleUrl: './admin-career-detail.scss',
})
export class AdminCareerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  careers = inject(CareerService);

  application: CareerApplication | undefined;
  notes = '';
  readonly loading = signal(true);
  readonly saved = signal(false);

  readonly statuses: CareerApplicationStatus[] = ['submitted', 'under-review', 'shortlisted', 'hired', 'rejected'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigateByUrl('/admin/careers');
      return;
    }

    this.careers.fetchById(id).subscribe({
      next: (app) => {
        this.application = app;
        this.notes = app.adminNotes;
        this.loading.set(false);
      },
      error: () => this.router.navigateByUrl('/admin/careers'),
    });
  }

  setStatus(status: CareerApplicationStatus): void {
    if (!this.application) return;
    this.careers.setStatus(this.application.id, status, this.notes).subscribe((app) => {
      this.application = app;
      this.notes = app.adminNotes;
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 1800);
    });
  }

  saveNotes(): void {
    if (!this.application) return;
    this.careers.setStatus(this.application.id, this.application.status, this.notes).subscribe((app) => {
      this.application = app;
      this.notes = app.adminNotes;
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 1800);
    });
  }

  remove(): void {
    if (!this.application) return;
    if (confirm('Delete this career application permanently?')) {
      this.careers.remove(this.application.id).subscribe(() => {
        this.router.navigateByUrl('/admin/careers');
      });
    }
  }
}
