import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendApplicationComponent } from './send-application.component';
import { MatFormField, MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatFormField,
    MatSelectModule,
    MatOptionModule,
    MatInputModule
  ],
  declarations: [SendApplicationComponent]
})
export class SendApplicationModule { }
