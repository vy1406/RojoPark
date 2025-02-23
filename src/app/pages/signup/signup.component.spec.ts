import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let router: Router;

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
        provideRouter([]),
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when filled correctly', () => {
    component.signupForm.setValue({
      email: 'test@example.com',
      password: '123456',
      confirmPassword: '123456'
    });
    expect(component.signupForm.valid).toBeTruthy();
  });

  it('should invalidate form if email is missing', () => {
    component.signupForm.setValue({
      email: '',
      password: '123456',
      confirmPassword: '123456'
    });
    expect(component.signupForm.invalid).toBeTruthy();
  });

  it('should invalidate form if password and confirm password do not match', () => {
    component.signupForm.setValue({
      email: 'test@example.com',
      password: '123456',
      confirmPassword: 'abcdef'
    });
    expect(component.signupForm.hasError('passwordMismatch')).toBeTruthy();
  });

  it('should navigate to home on successful signup', () => {
    spyOn(router, 'navigate');
    component.signupForm.setValue({
      email: 'test@example.com',
      password: '123456',
      confirmPassword: '123456'
    });
    component.onSubmit();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});
