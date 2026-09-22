import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NewsService } from '../../../core/services/news.service';
import { ApplicationService } from '../../../core/services/application.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboardComponent {
  news = inject(NewsService);
  applications = inject(ApplicationService);

  readonly publishedCount = computed(() => this.news.published().length);
  readonly draftCount = computed(() => this.news.all().length - this.publishedCount());
  readonly acceptedCount = computed(
    () => this.applications.all().filter((a) => a.status === 'accepted').length,
  );

  readonly recentApplications = computed(() => this.applications.all().slice(0, 5));
  readonly recentPosts = computed(() => this.news.all().slice(0, 5));
}
