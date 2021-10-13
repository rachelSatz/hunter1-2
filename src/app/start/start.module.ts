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
import { JobDetailesComponent } from './jobs/job-detailes/job-detailes.component';
import { JobProcessComponent } from './jobs/job-process/job-process.component';
const routes: Routes = [
  {
    path: '', component: StartComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomePageComponent},
      { path: 'letsStart', component: LetsStartComponent},
      { path: 'register', component: RegisterComponent},
      { path: 'success', component: SuccessComponent},
      { path: 'get-password', component: GetPasswordComponent},
      { path: 'jobDetail', component: JobDetailesComponent},
      { path: 'jobProcess', component: JobProcessComponent},





    ]
  }
];

@NgModule({
  declarations: [StartComponent, HomePageComponent, LetsStartComponent, RegisterComponent, SuccessComponent, GetPasswordComponent, JobDetailesComponent, JobDetailesComponent, JobProcessComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatButtonModule
  ]
})
export class StartModule { }
