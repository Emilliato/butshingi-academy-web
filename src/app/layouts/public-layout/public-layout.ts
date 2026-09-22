import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header';
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  template: `
    <app-site-header />
    <main>
      <router-outlet />
    </main>
    <app-site-footer />
  `,
})
export class PublicLayoutComponent {}
