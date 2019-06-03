import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { EditPaymentsComponent } from './edit-payments.component';

const routes: Routes = [
  { path: '', component: EditPaymentsComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})

export class EditPaymentsModule {


}
