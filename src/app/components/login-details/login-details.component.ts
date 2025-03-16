import { Component, inject } from '@angular/core';
import { AuthService, LoginDetails } from '../../services/auth-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-details',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './login-details.component.html',
  styleUrl: './login-details.component.scss'
})
export class LoginDetailsComponent {
  loginDetails = <LoginDetails>{ username: null, userId: null };
  private authService = inject(AuthService);

  constructor() {
    this.authService.loginDetails$.subscribe((loginDetails) => {
      this.loginDetails = loginDetails;
    });
  }
}
