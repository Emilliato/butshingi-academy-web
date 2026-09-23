import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="not-found">
      <div class="container">
        <span class="not-found__code">404</span>
        <h1>This page wandered off campus.</h1>
        <p>The page you're looking for doesn't exist or may have moved.</p>
        <a routerLink="/" class="btn btn--primary">Back to home</a>
      </div>
    </section>
  `,
  styles: [`
    .not-found {
      min-height: 70vh;
      display: grid;
      place-items: center;
      text-align: center;
      padding: 40px 24px;
    }
    .not-found__code {
      font-family: var(--font-heading);
      font-size: 5rem;
      color: var(--color-gold);
      display: block;
    }
    .not-found p { max-width: 42ch; margin: 12px auto 28px; }
  `],
})
export class NotFoundComponent implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.apply({
      title: 'Page not found',
      description: 'The page you are looking for could not be found.',
      path: '/404',
      noIndex: true,
    });
  }
}
