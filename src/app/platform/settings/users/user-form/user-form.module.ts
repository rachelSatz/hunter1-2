import { NgModule } from '@angular/core';
import {RouterModule, Routes } from '@angular/router';

import { CommonModule } from '@angular/common';
import { UserFormComponent } from './user-form.component';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule, MatInputModule} from '@angular/material';

import {UserService} from '../../../../shared/_services/http/user.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(this.routes),
    FormsModule,
    MatFormFieldModule, MatInputModule,

  ],
  declarations: [UserFormComponent],
  providers: [UserService]

})
export class UserFormModule {
}
