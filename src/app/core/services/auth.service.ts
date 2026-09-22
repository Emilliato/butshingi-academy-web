import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

const SESSION_KEY = 'butshingi.admin.session.v1';

/**
 * Demo-grade admin auth so the panel is usable out of the box.
 * IMPORTANT: credentials are checked client-side against a local value —
 * this is fine for a preview/demo but MUST be replaced with a real
 * authentication backend (e.g. Supabase Auth / Firebase Auth / your API)
 * before this site handles real applicant data in production.
 */
const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'ButshingiAcademy2026';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storage = inject(StorageService);

  private readonly session = signal<{ user: string; since: string } | null>(
    this.storage.read(SESSION_KEY, null),
  );

  readonly isAuthenticated = computed(() => this.session() !== null);
  readonly currentUser = computed(() => this.session()?.user ?? null);

  login(username: string, password: string): boolean {
    if (username.trim().toLowerCase() === DEMO_USERNAME && password === DEMO_PASSWORD) {
      const value = { user: username.trim(), since: new Date().toISOString() };
      this.session.set(value);
      this.storage.write(SESSION_KEY, value);
      return true;
    }
    return false;
  }

  logout(): void {
    this.session.set(null);
    this.storage.clear(SESSION_KEY);
  }
}
