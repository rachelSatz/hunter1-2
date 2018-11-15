import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProcessUploadComponent } from './process-upload.component';

const routes: Routes = [
  { path: '', component: ProcessUploadComponent, children: [
      { path: '', loadChildren: './upload-file/upload-file.module#UploadFileModule' }
  ]}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

  ],
  declarations: [ProcessUploadComponent],
  providers: [ProcessService]
})
export class ProcessUploadModule {}
