import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NewsPost, NewsPostDraft } from '../models/news.model';

interface NewsPostDto {
  newsPostId: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: NewsPost['category'];
  coverEmoji: string | null;
  coverImage: string | null;
  author: string;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
}

function toNewsPost(dto: NewsPostDto): NewsPost {
  return {
    id: String(dto.newsPostId),
    slug: dto.slug,
    title: dto.title,
    excerpt: dto.excerpt,
    body: dto.body,
    category: dto.category,
    coverEmoji: dto.coverEmoji ?? '',
    coverImage: dto.coverImage ?? undefined,
    author: dto.author,
    published: dto.published,
    publishedAt: dto.publishedAt,
    updatedAt: dto.updatedAt,
  };
}

/**
 * Talks to the EduFeesWeb API's /api/news endpoints. Reading published posts
 * (site + news detail pages) is anonymous; the admin surface under
 * /api/news/admin (list all, create, update, delete) requires staff sign-in.
 */
@Injectable({ providedIn: 'root' })
export class NewsService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/news`;
  private readonly adminUrl = `${environment.apiUrl}/news/admin`;

  private readonly posts = signal<NewsPost[]>([]);

  readonly all = computed(() => [...this.posts()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)));
  readonly published = computed(() => this.all().filter((p) => p.published));

  bySlug(slug: string): NewsPost | undefined {
    return this.posts().find((p) => p.slug === slug);
  }

  byId(id: string): NewsPost | undefined {
    return this.posts().find((p) => p.id === id);
  }

  /** Loads published posts for the public site (news list / home / news detail). */
  loadPublished(category?: string): Observable<NewsPost[]> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);

    return this.http.get<NewsPostDto[]>(this.baseUrl, { params }).pipe(
      map((list) => list.map(toNewsPost)),
      tap((list) => this.posts.set(list)),
    );
  }

  /** Fetches a single published post by slug (for deep links from /news/:slug). */
  fetchBySlug(slug: string): Observable<NewsPost> {
    return this.http.get<NewsPostDto>(`${this.baseUrl}/${slug}`).pipe(
      map(toNewsPost),
      tap((post) => this.upsert(post)),
    );
  }

  /** Loads every post (drafts included) for the admin news list. */
  loadAll(): Observable<NewsPost[]> {
    return this.http.get<NewsPostDto[]>(this.adminUrl).pipe(
      map((list) => list.map(toNewsPost)),
      tap((list) => this.posts.set(list)),
    );
  }

  /** Fetches a single post (any status) by id, for the admin edit form. */
  fetchById(id: string): Observable<NewsPost> {
    return this.http.get<NewsPostDto>(`${this.adminUrl}/${id}`).pipe(
      map(toNewsPost),
      tap((post) => this.upsert(post)),
    );
  }

  create(draft: NewsPostDraft): Observable<NewsPost> {
    return this.http.post<NewsPostDto>(this.adminUrl, draft).pipe(
      map(toNewsPost),
      tap((post) => this.upsert(post)),
    );
  }

  update(id: string, patch: Partial<NewsPostDraft>): Observable<NewsPost> {
    const current = this.byId(id);
    const merged = { ...current, ...patch };
    return this.http.put<NewsPostDto>(`${this.adminUrl}/${id}`, merged).pipe(
      map(toNewsPost),
      tap((post) => this.upsert(post)),
    );
  }

  remove(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.adminUrl}/${id}`)
      .pipe(tap(() => this.posts.update((list) => list.filter((p) => p.id !== id))));
  }

  private upsert(post: NewsPost): void {
    this.posts.update((list) => {
      const idx = list.findIndex((p) => p.id === post.id);
      if (idx === -1) return [post, ...list];
      const copy = [...list];
      copy[idx] = post;
      return copy;
    });
  }
}
