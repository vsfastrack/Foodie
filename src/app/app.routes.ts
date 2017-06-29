import { OTPComponent } from './OTP/otp.component';
import { SignupComponent } from './signup/signup.component';
import { LoginformComponent } from './loginform/loginform.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'login', component: LoginformComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: LoginformComponent },
  { path: 'otp', component: OTPComponent }
];

export const routing = RouterModule.forRoot(routes);