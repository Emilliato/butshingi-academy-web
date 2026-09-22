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
    this.post = this.news.bySlug(slug);

    if (!this.post || !this.post.published) {
      this.router.navigate(['/news']);
      return;
    }

    this.related = this.news
      .published()
      .filter((p) => p.id !== this.post!.id)
      .slice(0, 2);

    this.seo.apply({
      title: this.post.title,
      description: this.post.excerpt,
      path: `/news/${this.post.slug}`,
      type: 'article',
    });

    this.seo.setJsonLd('ld-article', {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: this.post.title,
      description: this.post.excerpt,
      datePublished: this.post.publishedAt,
      dateModified: this.post.updatedAt,
      author: { '@type': 'Person', name: this.post.author },
      publisher: { '@type': 'Organization', name: 'S. Butshingi Academy' },
    });
  }

  get paragraphs(): string[] {
    return this.post?.body.split('\n\n') ?? [];
  }
}
