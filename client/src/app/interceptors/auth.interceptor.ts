import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const protectedRoutes: { url: string; methods: string[] }[] = [
    // for example
    { url: '/api/protected', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
    { url: '/api/posts', methods: ['POST', 'DELETE'] },
    { url: '/api/user/profile', methods: ['GET', 'PUT'] }
  ];

  const needsAuth = protectedRoutes.some(route =>
    req.url.includes(route.url) && route.methods.includes(req.method)
  );

  if (token && needsAuth) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('Unauthorized! Redirecting to login...');
        authService.logout();
        window.location.href = '/login';
      }
      return throwError(() => error);
    })
  );
};
