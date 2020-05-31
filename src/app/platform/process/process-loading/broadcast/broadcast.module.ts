import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BroadcastComponent } from './broadcast.component';

const routes: Routes = [
  { path: '', component: BroadcastComponent }
];

@NgModule({
  declarations: [BroadcastComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ]
})
export class BroadcastModule { }
