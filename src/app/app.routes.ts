import { Routes } from '@angular/router';
import { adminGuard, guestOnlyGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
        title: 'S. Butshingi Academy — Mqonci, Eastern Cape',
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about').then((m) => m.AboutComponent),
        title: 'About us · S. Butshingi Academy',
      },
      {
        path: 'academics',
        loadComponent: () => import('./pages/academics/academics').then((m) => m.AcademicsComponent),
        title: 'Academics · S. Butshingi Academy',
      },
      {
        path: 'news',
        loadComponent: () => import('./pages/news/news-list').then((m) => m.NewsListComponent),
        title: 'News · S. Butshingi Academy',
      },
      {
        path: 'news/:slug',
        loadComponent: () => import('./pages/news/news-detail').then((m) => m.NewsDetailComponent),
      },
      {
        path: 'admissions',
        loadComponent: () => import('./pages/admissions/admissions').then((m) => m.AdmissionsComponent),
        title: 'Admissions & Intake Application · S. Butshingi Academy',
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact').then((m) => m.ContactComponent),
        title: 'Contact us · S. Butshingi Academy',
      },
    ],
  },
  {
    path: 'admin/login',
    canActivate: [guestOnlyGuard],
    loadComponent: () => import('./pages/admin/admin-login/admin-login').then((m) => m.AdminLoginComponent),
    title: 'Admin sign in · S. Butshingi Academy',
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboardComponent),
        title: 'Dashboard · Admin',
      },
      {
        path: 'news',
        loadComponent: () =>
          import('./pages/admin/admin-news-list/admin-news-list').then((m) => m.AdminNewsListComponent),
        title: 'Manage news · Admin',
      },
      {
        path: 'news/new',
        loadComponent: () =>
          import('./pages/admin/admin-news-edit/admin-news-edit').then((m) => m.AdminNewsEditComponent),
        title: 'New post · Admin',
      },
      {
        path: 'news/:id/edit',
        loadComponent: () =>
          import('./pages/admin/admin-news-edit/admin-news-edit').then((m) => m.AdminNewsEditComponent),
        title: 'Edit post · Admin',
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./pages/admin/admin-applications/admin-applications').then(
            (m) => m.AdminApplicationsComponent,
          ),
        title: 'Applications · Admin',
      },
      {
        path: 'applications/:id',
        loadComponent: () =>
          import('./pages/admin/admin-application-detail/admin-application-detail').then(
            (m) => m.AdminApplicationDetailComponent,
          ),
        title: 'Application detail · Admin',
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundComponent),
    title: 'Page not found · S. Butshingi Academy',
  },
];
