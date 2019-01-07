import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BroadcastComponent } from './broadcast.component';
import {RouterModule, Routes} from '@angular/router';
import { MatCheckboxModule } from '@angular/material';
import {FormsModule} from '@angular/forms';

const routes: Routes = [
  { path: '', component: BroadcastComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCheckboxModule,
    FormsModule
  ],
  declarations: [BroadcastComponent]
})
export class BroadcastModule { }
