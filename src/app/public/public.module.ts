import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule } from '@angular/material';

import { PublicComponent } from './public.component';
import { LoginComponent } from './login/login.component';
import { GuestGuard } from 'app/shared/_guards/guest.guard';
import { RegisterComponent } from './register/register.component';
import { AppHttpService } from 'app/shared/_services/http/app-http.service';
import { NotificationService } from '../shared/_services/notification.service';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '', component: PublicComponent, canActivate: [GuestGuard], children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  declarations: [PublicComponent, LoginComponent, RegisterComponent, ForgotPasswordComponent],
  providers: [GuestGuard, AppHttpService, NotificationService],
  entryComponents: [ForgotPasswordComponent]
})
export class PublicModule {}
