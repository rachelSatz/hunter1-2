import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { UsersComponent } from './users.component';

import {DataTableModule} from '../../../shared/data-table/data-table.module';
import { UserService } from '../../../shared/_services/http/user.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';

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
  providers: [UserService, EmployerService ]
})

export class UsersModule { }
