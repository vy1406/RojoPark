import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USERNAME_KEY = 'auth_username';
  private readonly USER_ID_KEY = 'auth_user_id';
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
    const mockResponse = { token: 'mock-token-123', username: 'bob', userId: '1' };

    return of(mockResponse).pipe(
      tap(response => {
        if (this.isBrowser) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USERNAME_KEY, response.username);
          localStorage.setItem(this.USER_ID_KEY, response.userId);
        }
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USERNAME_KEY);
      localStorage.removeItem(this.USER_ID_KEY);
    }
    this.isAuthenticatedSubject.next(false);
  }


  getUserId(): string | null {
    return this.isBrowser ? localStorage.getItem(this.USER_ID_KEY) : null;
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
