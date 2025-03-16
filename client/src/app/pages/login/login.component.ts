import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  loginForm: FormGroup;
  private authService = inject(AuthService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      // email: ['', [Validators.required, Validators.email]],
      // password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => {
          console.log('✅ Login successful. Redirecting...');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login failed:', err);
        }
      });
    }
  }

  loginWithBob() {
    this.authService.login('bob', 'password').subscribe({
      next: () => {
        console.log('✅ Login successful. Redirecting...');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login failed:', err);
      }
    });
  }

  loginWithAlice() {
    this.authService.login('alice', 'password').subscribe({
      next: () => {
        console.log('✅ Login successful. Redirecting...');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Login failed:', err);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
