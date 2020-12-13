import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserFormComponent } from './user-form.component';
import { UsersResolve } from '../../../shared/_resolves/users.resolve';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { BdSelectModule } from '../../../../assets/js/bd-select/bd-select.module';
import { DataTableModule } from '../../../shared/data-table/data-table.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { UserService } from '../../../../app/shared/_services/http/user.service';

const routes: Routes = [
  { path: '', component: UserFormComponent },
  { path: ':id', component: UserFormComponent, resolve: { user: UsersResolve } }
];

@NgModule({
  declarations: [UserFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    BdSelectModule,
    ReactiveFormsModule,
    DataTableModule,
    CKEditorModule
  ],
  providers: [UserService, UsersResolve]
})
export class UserFormModule { }
