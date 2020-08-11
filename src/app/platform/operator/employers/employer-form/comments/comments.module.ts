import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CommentsComponent } from './comments.component';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { UserService } from 'app/shared/_services/http/user.service';
import { UserFormComponent } from './user-form/user-form.component';
import { ShortNamePipe } from 'app/shared/_pipes/short-name.pipe';

const routes: Routes = [
  { path: '', component: CommentsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    BdSelectModule
  ],
  providers: [GeneralHttpService, UserService],
  declarations: [CommentsComponent, UserFormComponent, ShortNamePipe]
})
export class CommentsModule { }
