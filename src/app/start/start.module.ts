import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {StartComponent} from './start.component';
import { HomePageComponent } from 'app/start/home-page/home-page.component';
import { LetsStartComponent } from './lets-start/lets-start.component';
import { RegisterComponent } from './register/register.component';
import { SuccessComponent } from './jobs/success/success.component';
import { GetPasswordComponent } from 'app/get-password/get-password.component';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule } from '@angular/material';

const routes: Routes = [
  {
    path: '', component: StartComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomePageComponent},
      { path: 'letsStart', component: LetsStartComponent},
      { path: 'register', component: RegisterComponent},
      { path: 'success', component: SuccessComponent},
      { path: 'get-password', component: GetPasswordComponent},


    ]
  }
];

@NgModule({
  declarations: [StartComponent, HomePageComponent, LetsStartComponent, RegisterComponent, SuccessComponent, GetPasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatButtonModule
  ]
})
export class StartModule { }
