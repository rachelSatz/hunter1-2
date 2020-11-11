import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PlatformComponent } from './platform.component';
import { BdSelectModule } from '../../assets/js/bd-select/bd-select.module';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule,
  MatAutocompleteModule,
  MatMenuModule
} from '@angular/material';
import { HelpersService } from '../shared/_services/helpers.service';
import { UserSessionService } from '../shared/_services/http/user-session.service';
import { NotificationService } from '../shared/_services/notification.service';


const routes: Routes = [
  {
    path: '', component: PlatformComponent, children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', loadChildren: '../../app/platform/dashboard/dashboard.module#DashboardModule'},
      {path: 'employers', loadChildren: '../../app/platform/employers/employers.module#EmployersModule'},
      {path: 'finance/calc-processes', loadChildren: '../../app/platform/finance/calc-processes/calc-processes.module#CalcProcessesModule'},
      {path: 'finance/invoices', loadChildren: '../../app/platform/finance/invoices/invoices.module#InvoicesModule'},
      {path: 'finance/employers-id-display',
        loadChildren: '../../app/platform/finance/employers-id-display/employers-id-display.module#EmployersIdDisplayModule'},
      {path: 'users', loadChildren: '../../app/platform/users/users.module#UsersModule'}
    ]
  }
];
@NgModule({
  declarations: [
    PlatformComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatDatepickerModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatButtonModule,
    BdSelectModule,
    MatMenuModule],
  providers: [ HelpersService, UserSessionService, NotificationService ],
  exports: [ RouterModule ]

})
export class PlatformModule { }
