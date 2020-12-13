import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material';
import { UserSessionService } from '../shared/_services/http/user-session.service';
import { AppHttpService } from '../shared/_services/http/app-http.service';
import { RegisterComponent } from './register/register.component';
import { NotificationService } from '../shared/_services/notification.service';

const routes: Routes = [
  {
    path: '', component: PublicComponent, children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  }
];

@NgModule({
  declarations: [LoginComponent, PublicComponent, RegisterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatButtonModule],
  providers: [UserSessionService, AppHttpService, NotificationService]})
export class PublicModule { }
