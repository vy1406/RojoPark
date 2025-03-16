import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, 
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
      ],
      providers: [provideRouter([]), provideAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); 
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when filled correctly', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: '123456'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should invalidate form if email is missing', () => {
    component.loginForm.setValue({
      email: '',
      password: '123456'
    });
    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should invalidate form if password is too short', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: '123'
    });
    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should navigate to home on successful login', () => {
    spyOn(router, 'navigate'); 
    component.loginForm.setValue({
      email: 'test@example.com',
      password: '123456'
    });
    component.onSubmit();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});
