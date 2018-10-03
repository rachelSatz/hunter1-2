import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatDialogModule,
   MatProgressBarModule, MatSelectModule, MatTooltipModule, MatProgressSpinnerModule } from '@angular/material';
 import { FileDropModule   } from 'ngx-file-drop';
// import { Ng2FileDropModule } from 'ng2-file-drop';
import { TransitionDialogModule } from '../../../shared/transition-dialog/transition-dialog.module';
import { ProcessUploadComponent } from './process-upload.component';
import { PaymentPromptComponent } from './payment-prompt/payment-prompt.component';
import { EmployersSelectdModule } from '../../employers-select2/employers-select2-module';
import { Select2Module } from 'ng2-select2/ng2-select2';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
    MatProgressBarModule, MatTooltipModule ,
    TransitionDialogModule, EmployersSelectdModule, Select2Module, MatProgressSpinnerModule , FileDropModule 
  ],
  declarations: [ProcessUploadComponent, PaymentPromptComponent],
  entryComponents: [PaymentPromptComponent]
})
export class ProcessUploadModule {}
