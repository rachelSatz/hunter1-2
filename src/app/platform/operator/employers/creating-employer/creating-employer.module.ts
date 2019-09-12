import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import {
MatFormFieldModule,
MatIconModule,
MatInputModule,
MatOptionModule,
MatSelectModule
} from '@angular/material';

import { CreatingEmployerComponent } from './creating-employer.component';

import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';


const routes: Routes = [
  { path: '', component: CreatingEmployerComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BdSelectModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatIconModule
  ],
  declarations: [CreatingEmployerComponent],
  providers: [GeneralHttpService, FormBuilder]
})
export  class CreatingEmployerModule {

}

