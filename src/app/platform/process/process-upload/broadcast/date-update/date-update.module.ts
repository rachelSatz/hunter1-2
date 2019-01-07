import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateUpdateComponent } from './date-update.component';
import {MatDatepickerModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';


@NgModule({
  imports: [CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule],
  exports: [DateUpdateComponent],
  declarations: [DateUpdateComponent],
  entryComponents: [DateUpdateComponent]
})
export class DateUpdateModule {}
