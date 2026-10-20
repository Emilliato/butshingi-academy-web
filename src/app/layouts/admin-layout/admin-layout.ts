import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApplicationService } from '../../core/services/application.service';
import { CareerService } from '../../core/services/career.service';

interface AdminNavItem {
  path: string;
  label: string;
  icon: string;
  /** Roles allowed to see this item. Omit to show it to any signed-in staff member. */
  roles?: string[];
  badge?: () => number;
}

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
  careers = inject(CareerService);
  private router = inject(Router);

  /**
   * Nav visibility is controlled by role, mirroring EduFeesWeb's approach — each item can
   * list which roles see it. Today EduFeesWeb only issues Admin/Developer roles for staff
   * sign-in, so every item defaults to visible for any signed-in role; add a `roles: [...]`
   * list to an item once a more granular role (e.g. a recruiter-only Careers reviewer) exists.
   */
  private readonly navItems: AdminNavItem[] = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/admin/news', label: 'News', icon: '📰' },
    {
      path: '/admin/applications',
      label: 'Applications',
      icon: '🎓',
      badge: () => this.applications.pendingCount(),
    },
    {
      path: '/admin/careers',
      label: 'Careers',
      icon: '💼',
      badge: () => this.careers.pendingCount(),
    },
  ];

  readonly visibleNavItems = computed(() => {
    const role = this.auth.role();
    return this.navItems.filter((item) => !item.roles || (role !== null && item.roles.includes(role)));
  });

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/admin/login');
  }
}
