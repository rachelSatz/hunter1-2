import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatCheckboxModule, MatRadioModule, MatSelectModule,
          MatButtonModule } from '@angular/material';

import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';

import { UserFormComponent } from './user-form.component';

import { EmployerService } from 'app/shared/_services/http/employer.service';
import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { UserService } from 'app/shared/_services/http/user.service';

import { UsersResolve } from 'app/shared/_resolves/users.resolve';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { ChangeProjectManagerComponent } from './change-project-manager/change-project-manager.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

const routes: Routes = [
  { path: '', component: UserFormComponent },
  { path: ':id', component: UserFormComponent, resolve: { user: UsersResolve } }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatRadioModule, MatSelectModule, MatButtonModule,
    BdSelectModule,
    ReactiveFormsModule,
    DataTableModule,
    CKEditorModule
  ],
  declarations: [UserFormComponent, ChangeProjectManagerComponent],
  providers: [UserService, EmployerService, OrganizationService, UsersResolve],
  entryComponents: [
    ChangeProjectManagerComponent]

})
export class UserFormModule {
}
