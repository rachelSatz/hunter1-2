import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RouterModule} from '@angular/router';
import { MatDatepickerModule, MatFormFieldModule, MatSelectModule } from '@angular/material';
import { ProcessComponent } from './process.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule, MatSelectModule, MatDatepickerModule,
  ],
  declarations: [ProcessComponent]
})
export class ProcessModule { }
