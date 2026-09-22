import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SeoService } from '../../core/services/seo.service';
import { NewsService } from '../../core/services/news.service';
import { RevealDirective } from '../../core/directives/reveal.directive';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [RouterLink, DatePipe, RevealDirective],
  templateUrl: './news-list.html',
  styleUrl: './news-list.scss',
})
export class NewsListComponent implements OnInit {
  private seo = inject(SeoService);
  news = inject(NewsService);

  readonly activeCategory = signal<string>('All');
  readonly categories = ['All', 'Announcement', 'Event', 'Achievement', 'Community'];

  readonly filtered = computed(() => {
    const cat = this.activeCategory();
    const posts = this.news.published();
    return cat === 'All' ? posts : posts.filter((p) => p.category === cat);
  });

  ngOnInit(): void {
    this.seo.apply({
      title: 'News',
      description: 'Announcements, events and achievements from S. Butshingi Academy in Mqonci, Eastern Cape.',
      path: '/news',
    });
  }

  setCategory(cat: string): void {
    this.activeCategory.set(cat);
  }
}
