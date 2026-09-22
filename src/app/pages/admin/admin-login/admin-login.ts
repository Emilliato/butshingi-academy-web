import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);

  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    this.seo.apply({
      title: 'Admin sign in',
      description: 'Staff sign in for the S. Butshingi Academy admin panel.',
      path: '/admin/login',
      noIndex: true,
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { username, password } = this.form.getRawValue();
    const ok = this.auth.login(username, password);
    if (!ok) {
      this.error.set('Incorrect username or password. Please try again.');
      return;
    }
    this.error.set(null);
    const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/admin/dashboard';
    this.router.navigateByUrl(redirect);
  }
}
