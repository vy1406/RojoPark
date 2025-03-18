import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { passwordMatchValidator } from './validator';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm: FormGroup;
  private authService = inject(AuthService);

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: passwordMatchValidator() }
    );
  }


  onSubmit() {

    this.authService.signUp(
      this.username?.value,
      this.password?.value
    ).subscribe(
      (response) => {
        console.log(response);
      }
    );

  }



  get username() { return this.signupForm.get('username'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
}
