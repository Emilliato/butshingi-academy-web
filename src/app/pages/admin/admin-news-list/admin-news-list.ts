import { Component, inject } from '@angular/core';
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
export class AdminNewsListComponent {
  news = inject(NewsService);

  togglePublish(id: string, published: boolean): void {
    this.news.update(id, { published: !published });
  }

  remove(id: string, title: string): void {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      this.news.remove(id);
    }
  }
}
