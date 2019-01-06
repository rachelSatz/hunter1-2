import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FileDropModule } from 'ngx-file-drop';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule,
         MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';

import { ProcessUploadComponent } from '../process-upload/process-upload.component';
import { ProcessDataComponent } from './process-data.component';
<<<<<<< HEAD:src/app/platform/process/process-data/process-data.module.ts
=======
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressBarModule, MatProgressSpinnerModule,
  MatSelectModule, MatTooltipModule
} from '@angular/material';
import {BdSelectModule} from '../../../../../assets/js/bd-select/bd-select.module';
import {FileDropModule} from 'ngx-file-drop';
import { SelectDepComponent } from './select-dep/select-dep.component';
>>>>>>> 05fb9eb7f6a62f51ff2383c70eef5ae611395bb5:src/app/platform/process/process-upload/process-data/process-data.module.ts

const routes: Routes = [
  { path: '', component: ProcessDataComponent },
  { path: 'upload', loadChildren: '../process-upload/payment/payment.module#PaymentModule' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatButtonModule,
    BdSelectModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
    MatProgressBarModule, MatTooltipModule, MatProgressSpinnerModule, FileDropModule,
<<<<<<< HEAD:src/app/platform/process/process-data/process-data.module.ts
  ],
  declarations: [ProcessDataComponent, ProcessUploadComponent]
=======

  ],
  declarations: [ProcessDataComponent , SelectDepComponent],
  entryComponents: [SelectDepComponent]
>>>>>>> 05fb9eb7f6a62f51ff2383c70eef5ae611395bb5:src/app/platform/process/process-upload/process-data/process-data.module.ts
})
export class ProcessDataModule {}
