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
import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { ProductService } from 'app/shared/_services/http/product.service';


const routes: Routes = [
  {
    path: '', component: EmployerComponent, canActivate: [IsAuthenticatedGuard], children: [
      { path: '', loadChildren: './process-upload-employer/process-upload-employer.module' +
          '#ProcessUploadEmployerModule' },
      { path: 'payment-instructions-employer',
        loadChildren: './payment-instructions-employer/payment-instructions-employer.module' +
          '#PaymentInstructionsEmployerModule' },
      { path: 'files', loadChildren: 'app/shared/shared/detailed-files/detailed-files.module#DetailedFilesModule' },
      { path: 'records/:id' , loadChildren:  'app/shared/shared/detailed-records/detailed-records.module#DetailedRecordsModule'},
      { path: 'reference-employer', loadChildren: './reference-employer/reference-employer.module#ReferenceEmployerModule' },
      { path: 'broadcast-employer', loadChildren: './broadcast-employer/broadcast-employer.module#BroadcastEmployerModule' },
      { path: 'feedback-employer', loadChildren: './feedback-employer/feedback-employer.module#FeedbackEmployerModule' },
    ]
   }];

@NgModule({
  declarations: [EmployerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
  ],
  providers: [
    ProcessDataService,
    ProcessService,
    DocumentService,
    NotificationService,
    DepartmentService,
    OrganizationService,
    IsAuthenticatedGuard,
    ProductService,
    GeneralHttpService]
})
export class EmployerModule { }
