import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { CreateCharacterComponent } from './create-character/create-character.component';
import { CreateGameComponent } from './create-game/create-game.component';
import { CreateLayoutComponent } from './create-layout/create-layout.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FooterComponent } from './footer/footer.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'create-character', component: CreateCharacterComponent },
  { path: 'create-game', component: CreateGameComponent },
  { path: 'create-layout', component: CreateLayoutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '', component: FooterComponent, outlet: 'footer' }
];
