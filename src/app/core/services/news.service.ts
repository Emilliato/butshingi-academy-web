import { Injectable, computed, inject, signal } from '@angular/core';
import { NewsPost, NewsPostDraft } from '../models/news.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'butshingi.news.v1';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function seedPosts(): NewsPost[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'seed-1',
      slug: 'fourth-annual-luncheon-celebrates-top-learners',
      title: 'Fourth annual luncheon celebrates our top learners',
      excerpt:
        'Families, educators and community leaders gathered to hand out certificates to top-performing learners at our fourth annual awards luncheon.',
      body:
        'S. Butshingi Academy\'s 4th Luncheon was a great success! We came together to celebrate achievements, milestones, and the incredible journey we continue to share. A special thank you to everyone who made time to join us and celebrate this memorable occasion. Your presence made the day even more special.\n\nCertificates were awarded across every grade, and several learners were recognised for outstanding improvement, attendance and leadership. Events like these are more than a ceremony — they are proof of what consistent academic support, digital learning access and community partnership can do for a rural school. Thank you to every donor and volunteer who made this year possible.',
      category: 'Event',
      coverEmoji: '🏆',
      coverImage: 'images/luncheon-certificate.jpg',
      author: 'Khanya Butshingi',
      published: true,
      publishedAt: now,
      updatedAt: now,
    },
    {
      id: 'seed-2',
      slug: 'academy-football-team-builds-belonging-on-and-off-the-field',
      title: 'Academy football team builds belonging on and off the field',
      excerpt:
        'Our football programme is doing more than developing athletes — it is one of the biggest drivers behind our 100% attendance and retention figures.',
      body:
        'The Academy football team trains twice a week and competes against neighbouring schools across the Chris Hani District. Beyond the scoreline, the programme teaches discipline, teamwork and belonging — values that show up directly in our attendance and retention numbers.\n\nWe are looking for kit sponsors and a part-time coach ahead of next season. If your organisation would like to partner with our sport programme, please get in touch via the Contact page.',
      category: 'Achievement',
      coverEmoji: '⚽',
      coverImage: 'images/football-team.jpg',
      author: 'Vuyolwethu Manqeyi',
      published: true,
      publishedAt: now,
      updatedAt: now,
    },
    {
      id: 'seed-3',
      slug: 'applications-open-for-next-year-intake',
      title: 'Applications are open for next year\'s intake',
      excerpt:
        'S. Butshingi Academy is now accepting applications for the next academic year. Places are limited — apply early to secure your child\'s spot.',
      body:
        'We are excited to open applications for next year\'s intake. Our admissions team reviews every application individually and will contact guardians directly to confirm placement, required documents and orientation dates.\n\nHead to the Admissions page to complete the online application form. If you need help completing the form, call us on 073 587 5718 or visit us in Mqonci.',
      category: 'Announcement',
      coverEmoji: '📝',
      author: 'Nontyatyambo Mkalali',
      published: true,
      publishedAt: now,
      updatedAt: now,
    },
    {
      id: 'seed-4',
      slug: 'celebrating-our-top-achievers-milestone',
      title: 'Celebrating our top achievers\' milestone',
      excerpt:
        'Another proud milestone celebrated with our learners, staff and school leadership — recognising the hard work behind every certificate.',
      body:
        'We marked another special milestone with our learners this year, celebrating alongside our school leadership, staff and proud families. Moments like these remind us why we do this work — every certificate represents a learner who showed up, put in the effort and grew.\n\nThank you to our staff, directors and community for continuing to invest in these young people\'s futures.',
      category: 'Community',
      coverEmoji: '🎉',
      coverImage: 'images/graduation-cake.jpg',
      author: 'Khanya Butshingi',
      published: true,
      publishedAt: now,
      updatedAt: now,
    },
  ];
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  private storage = inject(StorageService);

  private readonly posts = signal<NewsPost[]>(
    this.storage.read<NewsPost[]>(STORAGE_KEY, seedPosts()),
  );

  readonly all = computed(() => [...this.posts()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)));
  readonly published = computed(() => this.all().filter((p) => p.published));

  bySlug(slug: string): NewsPost | undefined {
    return this.posts().find((p) => p.slug === slug);
  }

  byId(id: string): NewsPost | undefined {
    return this.posts().find((p) => p.id === id);
  }

  create(draft: NewsPostDraft): NewsPost {
    const now = new Date().toISOString();
    const baseSlug = slugify(draft.title) || `post-${Date.now()}`;
    let slug = baseSlug;
    let n = 2;
    while (this.posts().some((p) => p.slug === slug)) {
      slug = `${baseSlug}-${n++}`;
    }
    const post: NewsPost = {
      ...draft,
      slug,
      id: crypto.randomUUID(),
      updatedAt: now,
    };
    this.posts.update((list) => [post, ...list]);
    this.persist();
    return post;
  }

  update(id: string, patch: Partial<NewsPostDraft>): void {
    this.posts.update((list) =>
      list.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)),
    );
    this.persist();
  }

  remove(id: string): void {
    this.posts.update((list) => list.filter((p) => p.id !== id));
    this.persist();
  }

  private persist(): void {
    this.storage.write(STORAGE_KEY, this.posts());
  }
}
