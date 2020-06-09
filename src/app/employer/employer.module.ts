import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerComponent } from 'app/employer/employer.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { DocumentService } from 'app/shared/_services/http/document.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { DepartmentService } from 'app/shared/_services/http/department.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { IsAuthenticatedGuard } from 'app/shared/_guards/is-authenticated.guard';

const routes: Routes = [
  {
    path: '', component: EmployerComponent, canActivate: [IsAuthenticatedGuard], children: [
      { path: '', loadChildren: './process-upload-employer/process-upload-employer.module' +
          '#ProcessUploadEmployerModule' }
    ]
   }];

@NgModule({
  declarations: [EmployerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  providers: [
    ProcessDataService,
    ProcessService,
    DocumentService,
    NotificationService,
    DepartmentService,
    IsAuthenticatedGuard,
    GeneralHttpService]
})
export class EmployerModule { }
