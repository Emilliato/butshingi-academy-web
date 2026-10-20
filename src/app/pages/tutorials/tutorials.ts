import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const DRIVE_FOLDER_ID = '1rcF2_yu_bFcBgniGgLd_ckvIV9bY1THj';

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [],
  templateUrl: './tutorials.html',
  styleUrl: './tutorials.scss',
})
export class TutorialsComponent {
  private sanitizer = inject(DomSanitizer);

  readonly driveFolderUrl = `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`;
  readonly embedUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://drive.google.com/embeddedfolderview?id=${DRIVE_FOLDER_ID}#grid`,
  );
}
