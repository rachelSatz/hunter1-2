import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewEmployerComponent } from './new-employer.component';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';

const routes: Routes = [
  { path: '', component: NewEmployerComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    BdSelectModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule
  ],
  declarations: [NewEmployerComponent],
  providers: [GeneralHttpService, FormBuilder]
})
export class NewEmployerModule { }
