import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';

/**
 * Adds `.is-visible` once the host scrolls into view, powering the
 * fade-and-rise entrance animation defined in styles.scss ([appReveal]).
 * Usage: <div appReveal [revealDelay]="80"> ... </div>
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  @Input() revealDelay = 0;

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      return;
    }

    if (this.revealDelay) {
      node.style.transitionDelay = `${this.revealDelay}ms`;
    }

    // A fixed 15% threshold can never be met by an element taller than ~6x the viewport
    // (e.g. the admissions form on a phone), so cap it by what the viewport can actually show.
    const height = node.offsetHeight || 1;
    const threshold = Math.min(0.15, (window.innerHeight * 0.5) / height);

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add('is-visible');
            this.observer?.unobserve(node);
          }
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' },
    );

    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
