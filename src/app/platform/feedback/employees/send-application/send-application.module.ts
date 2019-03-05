import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendApplicationComponent } from './send-application.component';
import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule
  ],
  declarations: [SendApplicationComponent]
})
export class SendApplicationModule { }
