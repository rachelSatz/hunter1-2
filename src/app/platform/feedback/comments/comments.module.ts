import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './comments.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { FileDropModule } from 'ngx-file-drop';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';

const routes: Routes = [
  { path: '', component:  CommentsComponent }
];

@NgModule({
  declarations: [CommentsComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatIconModule,
    FileDropModule,
    MatInputModule,
  ],
  providers: [MonthlyTransferBlockService, GeneralHttpService]
})
export class CommentsModule { }
