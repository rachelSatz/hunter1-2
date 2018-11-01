import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatCheckboxModule, MatRadioModule, MatIconModule, MatButtonModule} from '@angular/material';

import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';

import { UserFormComponent } from './user-form.component';

import { EmployerService } from 'app/shared/_services/http/employer.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { UserService } from 'app/shared/_services/http/user.service';

import { UsersResolve } from 'app/shared/_resolves/users.resolve';


const routes: Routes = [
  { path: '', component: UserFormComponent },
  { path: ':id', component: UserFormComponent, resolve: { user: UsersResolve } }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatRadioModule, MatIconModule, MatButtonModule,
    BdSelectModule
  ],
  declarations: [UserFormComponent],
  providers: [UserService, EmployerService, OrganizationService]

})
export class UserFormModule {
}
