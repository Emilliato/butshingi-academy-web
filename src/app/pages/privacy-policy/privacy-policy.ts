import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { RevealDirective } from '../../core/directives/reveal.directive';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [RouterLink, RevealDirective],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
})
export class PrivacyPolicyComponent implements OnInit {
  private seo = inject(SeoService);

  readonly lastUpdated = 'October 2026';

  ngOnInit(): void {
    this.seo.apply({
      title: 'Privacy Policy',
      description: 'How S. Butshingi Academy collects, uses and protects personal information, including photos of learners, in line with POPIA.',
      path: '/privacy-policy',
      noIndex: false,
    });
  }
}
