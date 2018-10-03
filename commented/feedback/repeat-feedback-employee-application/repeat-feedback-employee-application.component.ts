

 import { Component, EventEmitter, OnInit, Output,Input } from '@angular/core';

import { ContactService } from '../../../shared/_services/http/contact.service';
import { FeedbackService } from '../../../shared/_services/http/feedback.service';
import { GeneralHttpService } from '../../../shared/_services/http/general-http.service';
import {NotificationService, NotificationType} from '../../../shared/_services/notification.service';

import { EmployeeFeedback } from '../../../shared/_models/employee-feedback.model';
import { Contact } from '../../../shared/_models/contact.model';
import { Application } from "../../../shared/_models/Application.model";

@Component({
  selector: 'app-repeat-feedback-employee-application',
  templateUrl: './repeat-feedback-employee-application.component.html',
  styleUrls: ['./repeat-feedback-employee-application.component.css']
})
export class RepeatFeedbackEmployeeApplicationComponent implements OnInit {

 @Output() closeApplication = new EventEmitter<number>();
  @Input() applicationType: number;
  @Input() feedback: EmployeeFeedback;
  @Input() employerId: number;
  @Input() contacts: Contact[];
  @Input() application: Application;
  @Input() files:  { id: string, fileName: string }[];
  searchCriteria = {};
  headerText: string;
  uploadedFile: File;
  selectedFileIds: number[];
  selectedContactIds: number[];
  comments: string;
  constructor(private contactService: ContactService, private feedbackService: FeedbackService,
              private generalService: GeneralHttpService, private notificationService: NotificationService) { }

  ngOnInit() {

    
    switch (this.applicationType) {
      case 2: {
        this.headerText = 'manufacturer';
        break;
      }
      case 1: {
        this.headerText = 'agent';
        break;
      }
      case 5: {
        this.headerText = 'employee';
        break;
      }
      
    }


  }

  ChengeradioAplication(value:string){
switch (value) {
      case 'manufacturer': {
       this.applicationType =2;
        break;
      }
    case 'agent': {
       this.applicationType =1;
        break;
      }
       case 'employee': {
       this.applicationType =5;
        break;
      }
  }
   
    let searchCriteria = [];
    searchCriteria['OwnerID'] = this.applicationType == 5 ? this.feedback.employee.id : this.feedback.product.manufacturer.id;
    searchCriteria['distribution'] = 5;
    searchCriteria['OwnerType'] =this.applicationType;
    this.contactService.getContactsByOwner(searchCriteria)
      .then(response => {
        this.contacts = response;
      }).then(x => {
        this.generalService.getFilesByEmployee(this.feedback.employee.id)
          .then(response => this.files = response) 
      });
    ;


  }
 getEnumLabel(key: number, enumStr: 'status' | 'productType'): string {
    if (enumStr === 'status') {
      return EmployeeFeedback.statusLabel.get(key);
    }
    if (enumStr === 'productType') {
      return EmployeeFeedback.productTypeLabel.get(key);
    }
  }
  onCloseClicked(): void {
    this.closeApplication.emit(0);
  }
 
  onSubmit(): void {
    const data = {
      applicationType: this.applicationType,
      feedback: this.feedback,
      selectedFileIds: this.selectedFileIds,
      selectedContactIds: this.selectedContactIds,
      comments: this.comments
    };

    this.feedbackService.createEmployeeApplication(data, this.uploadedFile)
    .then(res => {
        this.notificationService.showResult(res.message, res.success ? NotificationType.success : NotificationType.error);
    });
  }


}


