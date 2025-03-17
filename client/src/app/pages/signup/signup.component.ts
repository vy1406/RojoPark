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
  selectedFile: File | null = null;
  base64File: string | null = null;

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: passwordMatchValidator() }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
      const maxSize = 4 * 1024 * 1024; // 4MB max

      if (!allowedTypes.includes(file.type)) {
        console.error('❌ Invalid file type. Only PNG, JPG, and GIF allowed.');
        return;
      }

      if (file.size > maxSize) {
        console.error('❌ File too large. Max size: 4MB');
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.base64File = reader.result?.toString().split(',')[1] || null; // Remove the metadata part
      };
    }
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      console.log('❌ Invalid Form');
      return;
    }

    const payload = {
      email: this.signupForm.get('email')?.value,
      password: this.signupForm.get('password')?.value,
      fileBase64: this.base64File, // Send file as Base64 string
    };

    this.authService.signUp(payload).subscribe({
      next: (response) => {
        console.log('✅ Signup Response:', response);
      },
      error: (error) => {
        console.error('❌ Signup Error:', error);
      },
    });
  }

  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
}
