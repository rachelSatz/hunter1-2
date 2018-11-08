import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import { MatDatepickerModule, MatFormFieldModule, MatSelectModule } from '@angular/material';
import { ProcessComponent } from './process.component';

const routes: Routes = [
<<<<<<< HEAD
  { path: '', component: ProcessComponent }
  ];

=======
  { path: '', component: ProcessComponent },
];
>>>>>>> 65109f01326dcf3cf94905901194188257388d9d

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forRoot(routes),
    MatFormFieldModule, MatSelectModule, MatDatepickerModule,
  ],
  declarations: [ProcessComponent]
})
export class ProcessModule { }
