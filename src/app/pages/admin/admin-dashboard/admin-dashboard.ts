import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NewsService } from '../../../core/services/news.service';
import { ApplicationService } from '../../../core/services/application.service';
import { CareerService } from '../../../core/services/career.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboardComponent implements OnInit {
  news = inject(NewsService);
  applications = inject(ApplicationService);
  careers = inject(CareerService);

  readonly publishedCount = computed(() => this.news.published().length);
  readonly draftCount = computed(() => this.news.all().length - this.publishedCount());
  readonly acceptedCount = computed(
    () => this.applications.all().filter((a) => a.status === 'accepted').length,
  );

  readonly recentApplications = computed(() => this.applications.all().slice(0, 5));
  readonly recentPosts = computed(() => this.news.all().slice(0, 5));
  readonly recentCareers = computed(() => this.careers.all().slice(0, 5));

  ngOnInit(): void {
    this.applications.loadAll().subscribe();
    this.news.loadAll().subscribe();
    this.careers.loadAll().subscribe();
  }
}
