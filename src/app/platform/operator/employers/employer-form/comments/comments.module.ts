import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CommentsComponent } from './comments.component';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

const routes: Routes = [
  { path: '', component: CommentsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [GeneralHttpService],
  declarations: [CommentsComponent]
})
export class CommentsModule { }
