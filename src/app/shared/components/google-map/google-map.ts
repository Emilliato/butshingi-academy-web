import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-google-map',
  standalone: true,
  template: `
    <div class="map-frame" [class.map-frame--rounded]="rounded">
      <iframe
        [src]="safeUrl"
        width="100%"
        height="100%"
        style="border:0"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        title="S. Butshingi Academy on Google Maps"
      ></iframe>
    </div>
  `,
  styles: [`
    .map-frame {
      width: 100%;
      aspect-ratio: 16 / 10;
      overflow: hidden;
      box-shadow: var(--shadow-soft);
    }
    .map-frame--rounded { border-radius: var(--radius-lg); }
    iframe { display: block; }
  `],
})
export class GoogleMapComponent {
  /** Free-text place query — no API key required for the embed endpoint. */
  @Input() query = 'S. Butshingi Academy, Mqonci, Chris Hani District, Eastern Cape, South Africa';
  @Input() rounded = true;

  safeUrl: SafeResourceUrl;

  constructor(private dom: DomSanitizer) {
    this.safeUrl = this.dom.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps?q=${encodeURIComponent(this.query)}&output=embed`,
    );
  }
}
