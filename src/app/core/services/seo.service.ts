import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

const SITE_NAME = 'S. Butshingi Academy';
const SITE_URL = 'https://www.butshingiacademy.org.za';
const DEFAULT_IMAGE = '/images/learners-group.jpg';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private titleService: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  apply(data: SeoData): void {
    const fullTitle = data.title === SITE_NAME ? data.title : `${data.title} · ${SITE_NAME}`;
    const url = `${SITE_URL}${data.path ?? '/'}`;
    const image = data.image ?? DEFAULT_IMAGE;

    this.titleService.setTitle(fullTitle);

    this.setTag('description', data.description);
    this.setTag('robots', data.noIndex ? 'noindex, nofollow' : 'index, follow');

    this.setProperty('og:title', fullTitle);
    this.setProperty('og:description', data.description);
    this.setProperty('og:url', url);
    this.setProperty('og:image', image);
    this.setProperty('og:type', data.type ?? 'website');
    this.setProperty('og:site_name', SITE_NAME);

    this.setTag('twitter:title', fullTitle);
    this.setTag('twitter:description', data.description);
    this.setTag('twitter:image', image);
    this.setTag('twitter:card', 'summary_large_image');

    this.setCanonical(url);
  }

  /** Injects (or replaces) a JSON-LD <script> block for structured data. */
  setJsonLd(id: string, json: Record<string, unknown>): void {
    let script = this.doc.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.doc.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.text = JSON.stringify(json);
  }

  private setTag(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }

  private setCanonical(url: string): void {
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
