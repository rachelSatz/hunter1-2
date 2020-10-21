import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {PlatformComponent} from './platform.component';
import {BdSelectModule} from '../../assets/js/bd-select/bd-select.module';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule, MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatIconModule,
  MatAutocompleteModule
} from '@angular/material';
import {HelpersService} from '../shared/_services/helpers.service';
import {UserSessionService} from '../shared/_services/http/user-session.service';
import {NotificationService} from '../shared/_services/notification.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import {DashboardModule} from '../../app/platform/dashboard/dashboard.module';

const routes: Routes = [
  {
    path: '', component: PlatformComponent, children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', loadChildren:'../../app/platform/dashboard/dashboard.module#DashboardModule'},
      {path: 'employers', loadChildren:'../../app/platform/employers/employers.module#EmployersModule'},
      //{path: '', loadChildren: '../../app/platform/finance/finance.module#FinanceModule'},
      {path: 'finance', loadChildren: '../../app/platform/finance/finance.module#FinanceModule'},
      {path: 'invoices', loadChildren: '../../app/platform/invoices/invoices.module#InvoicesModule'},
      {path: 'invoices', loadChildren: '../../app/platform/invoices/invoices.module#InvoicesModule'},
      {path: 'users', loadChildren: '../../app/platform/users/users.module#UsersModule'}
    ]
  }
];

@NgModule({
  declarations: [
    PlatformComponent,
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
    MatDatepickerModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatButtonModule,BdSelectModule
  ],
  providers: [HelpersService,UserSessionService,NotificationService],
  exports: [RouterModule]

})
export class PlatformModule { }
