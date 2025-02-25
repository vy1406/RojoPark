import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { ParkComponent } from './pages/park/park.component';
import { PostComponent } from './pages/post/post.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'parks/:id', component: ParkComponent },
  { path: 'post/:id', component: PostComponent },

  { path: '**', redirectTo: '' }
];
