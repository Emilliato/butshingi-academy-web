import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';

/**
 * Animates a number counting up from 0 to [countTo] once visible.
 * Usage: <span appCountUp [countTo]="92" suffix="%"></span>
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private frame?: number;
  private started = false;

  @Input() countTo = 0;
  @Input() duration = 1400;
  @Input() suffix = '';
  @Input() prefix = '';

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    node.textContent = `${this.prefix}0${this.suffix}`;

    if (typeof IntersectionObserver === 'undefined') {
      this.animate();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !this.started) {
            this.started = true;
            this.animate();
            this.observer?.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    this.observer.observe(node);
  }

  private animate(): void {
    const node = this.el.nativeElement;
    const start = performance.now();
    const target = this.countTo;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / this.duration);
      const value = Math.round(target * ease(progress));
      node.textContent = `${this.prefix}${value}${this.suffix}`;
      if (progress < 1) {
        this.frame = requestAnimationFrame(step);
      }
    };
    this.frame = requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.frame) cancelAnimationFrame(this.frame);
  }
}
