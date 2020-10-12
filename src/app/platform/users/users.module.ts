import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from './users.component';
import {DataTableModule} from '../../shared/data-table/data-table.module';
import {BdSelectModule} from '../../../assets/js/bd-select/bd-select.module';
import {AppHttpService} from '../../shared/_services/http/app-http.service';
import { UserFormComponent } from './user-form/user-form.component';
import {UserService} from '../../shared/_services/http/user.service';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'form', loadChildren: '../../../app/platform/users/user-form/user-form.module#UserFormModule' }
];

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule,
    BdSelectModule,
  ],
  providers: [
    AppHttpService, UserService
  ]
})
export class UsersModule { }
