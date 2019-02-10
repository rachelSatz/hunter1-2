import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewEmployerComponent } from './new-employer.component';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [
  { path: '', component: NewEmployerComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule
  ],
  declarations: [NewEmployerComponent]
})
export class NewEmployerModule { }
