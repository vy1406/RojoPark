import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USERNAME_KEY = 'auth_username';
  private isBrowser: boolean;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.isAuthenticatedSubject.next(this.hasToken());
    }
  }

  login(email: string, password: string): Observable<{ token: string; username: string }> {
    const mockResponse = { token: 'mock-token-123', username: 'bob' };

    return of(mockResponse).pipe(
      tap(response => {
        if (this.isBrowser) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USERNAME_KEY, response.username);
        }
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USERNAME_KEY);
    }
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  getUsername(): string | null {
    return this.isBrowser ? localStorage.getItem(this.USERNAME_KEY) : null;
  }

  isLoggedIn(): boolean {
    return this.isBrowser ? !!this.getToken() : false;
  }

  private hasToken(): boolean {
    return this.isBrowser ? !!localStorage.getItem(this.TOKEN_KEY) : false;
  }
}
