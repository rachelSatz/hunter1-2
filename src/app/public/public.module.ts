import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';

import { PublicComponent } from './public.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { AppHttpService } from 'app/shared/_services/http/app-http.service';

import { GuestGuard } from 'app/shared/_guards/guest.guard';

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
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  declarations: [PublicComponent, LoginComponent, RegisterComponent],
  providers: [GuestGuard, AppHttpService]
})
export class PublicModule {}
