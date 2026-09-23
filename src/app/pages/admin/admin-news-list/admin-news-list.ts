import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NewsService } from '../../../core/services/news.service';

@Component({
  selector: 'app-admin-news-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './admin-news-list.html',
  styleUrl: './admin-news-list.scss',
})
export class AdminNewsListComponent implements OnInit {
  news = inject(NewsService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.error.set(null);
    this.news.loadAll().subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load news posts from the server. Please try again.');
      },
    });
  }

  togglePublish(id: string, published: boolean): void {
    this.news.update(id, { published: !published }).subscribe();
  }

  remove(id: string, title: string): void {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      this.news.remove(id).subscribe();
    }
  }
}
