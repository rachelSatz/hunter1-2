import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatDialogModule, MatSelectModule, MatSlideToggleModule,
  MatChipsModule, MatCheckboxModule, MatTooltipModule, MatProgressSpinnerModule
} from '@angular/material';
import { Select2Module } from 'ng2-select2';

import { DataTableModule } from '../../shared/data-table/data-table.module';
import { FeedbackGraphModule } from './feedback-graph/feedback-graph.module';

import { FeedbackEmployeeTableComponent } from './feedback-employee-table/feedback-employee-table.component';
import { FeedbackEmployeeTableDetailsComponent } from './feedback-employee-table-details/feedback-employee-table-details.component';
import { FeedbackFileTableComponent } from './feedback-file-table/feedback-file-table.component';
import { FeedbackService } from '../../shared/_services/http/feedback.service';
import { RejectedEmployeeComponent } from './rejected-employee/rejected-employee.component';
import { RejectedFileComponent } from './rejected-file/rejected-file.component';
import { FeedbackEmployeeApplicationComponent } from './feedback-employee-application/feedback-employee-application.component';
import { FeedbackFileApplicationComponent } from './feedback-file-application/feedback-file-application.component';
import { EmployersSelectdModule } from "../employers-select2/employers-select2-module";
import { RepeatFeedbackEmployeeApplicationComponent } from "./repeat-feedback-employee-application/repeat-feedback-employee-application.component";
import { ApplicationCommentComponent } from './application-comment/application-comment.component';
import { RepeatFeedbackFileApplicationComponent } from "./repeat-feedback-file-application/repeat-feedback-file-application.component";
import { FeedbackFileCommentComponent } from "./feedback-file-comment/feedback-file-comment.component";






@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule, MatInputModule, MatDialogModule, MatSelectModule, MatSlideToggleModule,
    Select2Module,
    DataTableModule,MatTooltipModule,
    FeedbackGraphModule,EmployersSelectdModule,Select2Module,
     MatChipsModule,MatCheckboxModule,MatProgressSpinnerModule
  ],
  declarations: [
    FeedbackEmployeeTableComponent,
    FeedbackEmployeeTableDetailsComponent,
    FeedbackFileTableComponent,
    RejectedEmployeeComponent,
    RejectedFileComponent,
    FeedbackEmployeeApplicationComponent,
    FeedbackFileApplicationComponent,
    RepeatFeedbackEmployeeApplicationComponent,
    ApplicationCommentComponent,
    RepeatFeedbackFileApplicationComponent,
    FeedbackFileCommentComponent,
 
    
  ],
  entryComponents: [
    FeedbackEmployeeTableDetailsComponent,ApplicationCommentComponent,FeedbackFileCommentComponent,
    FeedbackFileApplicationComponent,RepeatFeedbackFileApplicationComponent],
  providers: [FeedbackService],
})
export class FeedbackModule {}
