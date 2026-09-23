import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SeoService } from '../../core/services/seo.service';
import { NewsService } from '../../core/services/news.service';
import { NewsPost } from '../../core/models/news.model';
import { RevealDirective } from '../../core/directives/reveal.directive';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, RevealDirective],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.scss',
})
export class NewsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);
  news = inject(NewsService);

  post: NewsPost | undefined;
  related: NewsPost[] = [];

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';

    this.news.fetchBySlug(slug).subscribe({
      next: (post) => this.onPostLoaded(post),
      error: () => this.router.navigate(['/news']),
    });
  }

  private onPostLoaded(post: NewsPost): void {
    this.post = post;

    this.seo.apply({
      title: post.title,
      description: post.excerpt,
      path: `/news/${post.slug}`,
      type: 'article',
    });

    this.seo.setJsonLd('ld-article', {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: { '@type': 'Person', name: post.author },
      publisher: { '@type': 'Organization', name: 'S. Butshingi Academy' },
    });

    this.news.loadPublished().subscribe((posts) => {
      this.related = posts.filter((p) => p.id !== post.id).slice(0, 2);
    });
  }

  get paragraphs(): string[] {
    return this.post?.body.split('\n\n') ?? [];
  }
}
