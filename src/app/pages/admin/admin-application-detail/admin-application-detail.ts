import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../core/services/application.service';
import { ApplicationStatus, IntakeApplication } from '../../../core/models/application.model';

@Component({
  selector: 'app-admin-application-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './admin-application-detail.html',
  styleUrl: './admin-application-detail.scss',
})
export class AdminApplicationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  applications = inject(ApplicationService);

  application: IntakeApplication | undefined;
  notes = '';
  readonly loading = signal(true);
  readonly saved = signal(false);

  readonly statuses: ApplicationStatus[] = ['submitted', 'under-review', 'accepted', 'waitlisted', 'declined'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigateByUrl('/admin/applications');
      return;
    }

    this.applications.fetchById(id).subscribe({
      next: (app) => {
        this.application = app;
        this.notes = app.adminNotes;
        this.loading.set(false);
      },
      error: () => this.router.navigateByUrl('/admin/applications'),
    });
  }

  setStatus(status: ApplicationStatus): void {
    if (!this.application) return;
    this.applications.setStatus(this.application.id, status, this.notes).subscribe((app) => {
      this.application = app;
      this.notes = app.adminNotes;
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 1800);
    });
  }

  saveNotes(): void {
    if (!this.application) return;
    this.applications.setStatus(this.application.id, this.application.status, this.notes).subscribe((app) => {
      this.application = app;
      this.notes = app.adminNotes;
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 1800);
    });
  }

  remove(): void {
    if (!this.application) return;
    if (confirm('Delete this application permanently?')) {
      this.applications.remove(this.application.id).subscribe(() => {
        this.router.navigateByUrl('/admin/applications');
      });
    }
  }
}
