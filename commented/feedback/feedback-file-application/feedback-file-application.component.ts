import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ContactService } from '../../../shared/_services/http/contact.service';
import { FeedbackService } from '../../../shared/_services/http/feedback.service';
import { GeneralHttpService } from '../../../shared/_services/http/general-http.service';
import {NotificationService, NotificationType} from '../../../shared/_services/notification.service';

import { FileFeedback } from '../../../shared/_models/file-feedback.model';
import { Contact } from '../../../shared/_models/contact.model';

@Component({
  selector: 'app-feedback-file-application',
  templateUrl: './feedback-file-application.component.html',
  styleUrls: ['./feedback-file-application.component.css']
})
export class FeedbackFileApplicationComponent implements OnInit {
  searchCriteria = {};
  contacts:  Contact[] = [];
  files: {id: string, fileName: string}[] = [];
  feedback: FileFeedback;
  employerId: number;

  selectedFileIds: number[];
  uplodedFile: File = <File>{};
  comments: string;
  selectedContactIds: number[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private contactService: ContactService,
              private feedbackService: FeedbackService,
              private generalService: GeneralHttpService,
              private notificationService: NotificationService,
              public dialogRef: MatDialogRef<FeedbackFileApplicationComponent>) {
    this.feedback = data.feedback;
    this.employerId = data.employerId;
  }

  ngOnInit() {
 console.log("this.feedback",this.feedback);
 
    this.searchCriteria['manufacturerId'] = this.feedback.manufacturer.id;
    this.searchCriteria['productType'] = this.feedback.productType;
    this.searchCriteria['distribution'] = 7;
    this.contactService.getManufactureContacts(this.searchCriteria)
      .then(response => {
        this.contacts = response;
     });
    this.generalService.getFilesByEmployer(this.employerId)
     .then(response => this.files = response);
  }

  onSubmit(): void {
    this.feedbackService.createFileApplication(this.feedback, this.uplodedFile, this.selectedFileIds,
    this.selectedContactIds, this.comments)
    .then(res => {
      this.notificationService.showResult(String(res.message),
      Boolean(res.success) ? NotificationType.success : NotificationType.error);
    });
  }

  onCloseClicked(): void {
    this.dialogRef.close();
  }

}
