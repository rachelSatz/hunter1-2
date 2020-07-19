import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BroadcastEmployerComponent } from './broadcast-employer.component';

const routes: Routes = [
  { path: '', component: BroadcastEmployerComponent}];


@NgModule({
  declarations: [BroadcastEmployerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

  ]
})
export class BroadcastEmployerModule { }
