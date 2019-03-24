import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { AppHttpService } from 'app/shared/_services/http/app-http.service';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { UserService } from 'app/shared/_services/http/user.service';
import { UsersComponent } from './users.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'form', loadChildren: 'app/platform/settings/users/user-form/user-form.module#UserFormModule' }
];



@NgModule({
  imports: [
    CommonModule,
    BdSelectModule,
    RouterModule.forChild(routes),
    DataTableModule,
  ],
  declarations: [UsersComponent],
  providers: [UserService, EmployerService, AppHttpService]
})

export class UsersModule { }
