import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SignupComponent,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
      ],
      providers: [
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('should validate email field correctly', () => {
    const emailControl = component.signupForm.get('email');

    emailControl?.setValue('');
    expect(emailControl?.invalid).toBeTruthy();
    expect(emailControl?.errors?.['required']).toBeTruthy();

    emailControl?.setValue('invalid-email');
    expect(emailControl?.invalid).toBeTruthy();
    expect(emailControl?.errors?.['email']).toBeTruthy();

    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate password field correctly', () => {
    const passwordControl = component.signupForm.get('password');

    passwordControl?.setValue('');
    expect(passwordControl?.invalid).toBeTruthy();
    expect(passwordControl?.errors?.['required']).toBeTruthy();

    passwordControl?.setValue('123');
    expect(passwordControl?.invalid).toBeTruthy();
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();

    passwordControl?.setValue('123456');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should show password mismatch error if passwords do not match', () => {
    component.signupForm.setValue({
      email: 'test@example.com',
      password: '123456',
      confirmPassword: 'abcdef'
    });

    expect(component.signupForm.errors?.['passwordMismatch']).toBeTruthy();
  });

  it('should not show password mismatch error if passwords match', () => {
    component.signupForm.setValue({
      email: 'test@example.com',
      password: '123456',
      confirmPassword: '123456'
    });

    expect(component.signupForm.errors?.['passwordMismatch']).toBeFalsy();
  });

  it('should submit form when valid', () => {
    spyOn(console, 'log');

    component.signupForm.setValue({
      email: 'test@example.com',
      password: '123456',
      confirmPassword: '123456'
    });

    component.onSubmit();
    expect(console.log).toHaveBeenCalledWith('Form Submitted:', component.signupForm.value);
  });
});
