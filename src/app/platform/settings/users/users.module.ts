import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import {RouterModule, Routes} from '@angular/router';
import {DataTableModule} from '../../../shared/data-table/data-table.module';
import { UserService } from '../../../shared/_services/http/user.service';


const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'form', loadChildren: 'app/platform/settings/employers/employer-form/employer-form.module#EmployerFormModule' }
];



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  declarations: [UsersComponent],
  providers: [UserService ]
})

export class UsersModule { }
