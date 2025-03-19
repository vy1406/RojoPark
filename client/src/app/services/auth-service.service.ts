import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface LoginDetails {
  username: string | null;
  userId: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USERNAME_KEY = 'auth_username';
  private readonly USER_ID_KEY = 'auth_user_id';
  private apiUrl = 'https://1nqmm2z7x0.execute-api.us-east-1.amazonaws.com/prod';

  private isBrowser: boolean;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private loginDetailsSubject = new BehaviorSubject<LoginDetails>({
    username: null,
    userId: null,
  });

  loginDetails$ = this.loginDetailsSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const isLoggedIn = this.hasToken();
      this.isAuthenticatedSubject.next(isLoggedIn);

      this.loginDetailsSubject.next({
        username: localStorage.getItem(this.USERNAME_KEY),
        userId: localStorage.getItem(this.USER_ID_KEY),
      });
    }
  }

  signUp(username: string, password: string): Observable<any> {
    const body = {
      username,
      password,
    }
    return this.http.post(`${this.apiUrl}/signup`, body);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string; username: string; userId: string }>(
      `${this.apiUrl}/login`,
      { username, password }
    ).pipe(
      tap(response => {
        if (this.isBrowser) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USERNAME_KEY, response.username);
          localStorage.setItem(this.USER_ID_KEY, response.userId);
        }
        this.isAuthenticatedSubject.next(true);
        this.loginDetailsSubject.next({ username: response.username, userId: response.userId });
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
