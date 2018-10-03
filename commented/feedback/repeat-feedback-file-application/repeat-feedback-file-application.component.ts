import { Component, OnInit, EventEmitter, Output, Input, Inject } from '@angular/core';
import { Contact } from "../../../shared/_models/contact.model";
import { Application } from "../../../shared/_models/Application.model";
import { FileFeedbackError } from "../../../shared/_models/file-feedback-error";
import { ContactService } from "../../../shared/_services/http/contact.service";
import { FeedbackService } from "../../../shared/_services/http/feedback.service";
import { NotificationService, NotificationType } from "../../../shared/_services/notification.service";
import { GeneralHttpService } from "../../../shared/_services/http/general-http.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { EmployeeFeedback } from "../../../shared/_models/employee-feedback.model";

@Component({
  selector: 'app-repeat-feedback-file-application',
  templateUrl: './repeat-feedback-file-application.component.html',
  styleUrls: ['./repeat-feedback-file-application.component.css']
})
export class RepeatFeedbackFileApplicationComponent implements OnInit {


  @Output() closeApplication = new EventEmitter<number>();
  searchCriteria = {};
  headerText: string;
  uploadedFile: File;
  selectedFileIds: number[];
  selectedContactIds: number[];
  comments: string;
  constructor(private contactService: ContactService, private feedbackService: FeedbackService,@Inject(MAT_DIALOG_DATA) public data: any,
              private generalService: GeneralHttpService, private notificationService: NotificationService) { }

  ngOnInit() {

    
    switch (this.data.applicationType) {
      case 2: {
        this.headerText = 'manufacturer';
        break;
      }
      case 1: {
        this.headerText = 'agent';
        break;
      }
     
      
    }
    console.log("data",this.data);


  }
 getEnumLabel(key: number, enumStr: 'status' | 'productType'): string {
    if (enumStr === 'status') {
      return EmployeeFeedback.statusLabel.get(key);
    }
    if (enumStr === 'productType') {
      return EmployeeFeedback.productTypeLabel.get(key);
    }
  }
  ChengeradioAplication(value:string){
switch (value) {
      case 'manufacturer': {
       this.data.applicationType =2;
        break;
      }
    case 'agent': {
       this.data.applicationType =1;
        break;
      }
   
  }
   
    let searchCriteria = [];
    searchCriteria['OwnerID'] =  this.data.feedback.manufacturer.id;
    searchCriteria['distribution'] = 5;
    searchCriteria['OwnerType'] =this.data.applicationType;
    this.contactService.getContactsByOwner(searchCriteria)
      .then(response => {
        this.data.contacts = response;
      }).then();
    ;


  }

  onCloseClicked(): void {
    this.closeApplication.emit(0);
  }
 
  onSubmit(): void {
    const data = {
      applicationType: this.data.applicationType,
      feedback: this.data.feedback,
      selectedFileIds: this.selectedFileIds,
      selectedContactIds: this.selectedContactIds,
      comments: this.comments
    };

        this.feedbackService.createFileApplication(this.data.feedback, this.uploadedFile, this.selectedFileIds,
    this.selectedContactIds, this.comments)
    .then(res => {
        this.notificationService.showResult(res.message, res.success ? NotificationType.success : NotificationType.error);
    });
  }
}
