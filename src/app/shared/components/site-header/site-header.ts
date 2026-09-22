import { Component, HostListener, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeaderComponent {
  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);
  readonly nextIntakeYear = new Date().getFullYear() + 1;

  readonly links: NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Academics', path: '/academics' },
    { label: 'News', path: '/news' },
    { label: 'Contact', path: '/contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
