import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SeoService } from '../../core/services/seo.service';
import { RevealDirective } from '../../core/directives/reveal.directive';

const DRIVE_FOLDER_ID = '1rcF2_yu_bFcBgniGgLd_ckvIV9bY1THj';

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './tutorials.html',
  styleUrl: './tutorials.scss',
})
export class TutorialsComponent implements OnInit {
  private seo = inject(SeoService);
  private sanitizer = inject(DomSanitizer);

  readonly driveFolderUrl = `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`;
  readonly embedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://drive.google.com/embeddedfolderview?id=${DRIVE_FOLDER_ID}#grid`,
  );

  ngOnInit(): void {
    this.seo.apply({
      title: 'Tutorials',
      description: 'Video lessons and study resources from S. Butshingi Academy educators, for learners to watch and revise at home.',
      path: '/tutorials',
    });
  }
}
