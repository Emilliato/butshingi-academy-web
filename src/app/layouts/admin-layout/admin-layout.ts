import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApplicationService } from '../../core/services/application.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  applications = inject(ApplicationService);
  private router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/admin/login');
  }
}
