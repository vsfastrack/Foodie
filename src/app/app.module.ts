import { OTPComponent } from './OTP/otp.component';
import { ApiManager } from './Common/api-manager.service';
import { routing } from './app.routes';
import { browser } from 'protractor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule ,Routes } from '@angular/router';

import 'hammerjs';
import { LoginformComponent } from './loginform/loginform.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginformComponent,
    SignupComponent,
    OTPComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule ,
    MaterialModule,
    routing,
  ],
  providers: [ApiManager],
  bootstrap: [AppComponent]
})
export class AppModule { }
