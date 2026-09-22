import { Injectable } from '@angular/core';

/**
 * Thin wrapper around localStorage so every persisted service reads/writes
 * through one place. Swap this implementation for an HTTP client later
 * without touching NewsService / ApplicationService consumers.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly available = typeof window !== 'undefined' && !!window.localStorage;

  read<T>(key: string, fallback: T): T {
    if (!this.available) return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  write<T>(key: string, value: T): void {
    if (!this.available) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked — fail silently in demo mode */
    }
  }

  clear(key: string): void {
    if (!this.available) return;
    window.localStorage.removeItem(key);
  }
}
