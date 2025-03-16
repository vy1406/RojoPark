import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { ParkComponent } from './pages/park/park.component';
import { PostComponent } from './pages/post/post.component';
import { PostFormComponent } from './pages/post-form/post-form.component';
import { PrivateComponent } from './pages/private/private.component';
import { authGuard } from './guards/auth.guard';
import { ParkNewComponent } from './pages/park-new/park-new.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'parks/:id', component: ParkComponent },
  { path: 'parks/:id/form', component: PostFormComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'private', component: PrivateComponent, canActivate: [authGuard] },
  { path: 'park/new', component: ParkNewComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
