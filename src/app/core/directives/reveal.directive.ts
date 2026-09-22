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

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add('is-visible');
            this.observer?.unobserve(node);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    );

    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
