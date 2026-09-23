import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

const SESSION_KEY = 'butshingi.admin.session.v1';

interface AdminSession {
  token: string;
  user: string;
  roleName: string;
  since: string;
}

interface LoginResponseDto {
  accessToken: string;
  username: string;
  roleName: string;
}

/**
 * Staff sign-in against the EduFeesWeb API's real auth endpoints (JWT-based).
 * Staff accounts must exist in EduFeesWeb's Users table with an Admin/Developer role.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  private readonly session = signal<AdminSession | null>(
    this.storage.read<AdminSession | null>(SESSION_KEY, null),
  );

  readonly isAuthenticated = computed(() => this.session() !== null);
  readonly currentUser = computed(() => this.session()?.user ?? null);
  readonly token = computed(() => this.session()?.token ?? null);

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<LoginResponseDto>(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      map((res) => {
        const value: AdminSession = {
          token: res.accessToken,
          user: res.username,
          roleName: res.roleName,
          since: new Date().toISOString(),
        };
        this.session.set(value);
        this.storage.write(SESSION_KEY, value);
        return true;
      }),
      catchError(() => of(false)),
    );
  }

  logout(): void {
    this.session.set(null);
    this.storage.clear(SESSION_KEY);
  }
}
