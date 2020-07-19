import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReferenceEmployerComponent } from 'app/employer/reference-employer/reference-employer.component';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material';
import { FileDropModule } from 'ngx-file-drop';
import { DatePickerModule } from 'app/shared/app-date-picker/app-date-picker.module';

const routes: Routes = [
  { path: '', component: ReferenceEmployerComponent },
];

@NgModule({
  declarations: [ReferenceEmployerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FileDropModule,
    MatButtonModule,
    DatePickerModule,
    MatCheckboxModule,
    MatDatepickerModule,
  ]
})
export class ReferenceEmployerModule { }
