import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipsComponent } from './chips.component';
import { MatChipInputEvent } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [ChipsComponent],
  declarations: [ChipsComponent],

})
export class ChipsModule { }

