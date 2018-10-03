import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { EmployeeFeedback } from '../../../shared/_models/employee-feedback.model';
import { Contact } from "../../../shared/_models/contact.model";
import { ContactService } from "../../../shared/_services/http/contact.service";
import { GeneralHttpService } from "../../../shared/_services/http/general-http.service";
import { Application } from "../../../shared/_models/Application.model";

@Component({
  selector: 'app-feedback-employee-table-details',
  templateUrl: './feedback-employee-table-details.component.html',
  styleUrls: ['./feedback-employee-table-details.component.css']
})
export class FeedbackEmployeeTableDetailsComponent implements OnInit {

  spin:boolean=true;
  dialogStep:number = -1;
  GetdialogStep:number = 0;
  feedback: EmployeeFeedback;
  employerId: number;
  Repeat: boolean = false;
  application: Application;
  contacts: Contact[] = [];
  files: { id: string, fileName: string }[] = [];
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FeedbackEmployeeTableDetailsComponent>
    , private contactService: ContactService, private generalService: GeneralHttpService) {
    this.feedback = data.feedback;
    this.employerId = data.employerId;
    this.GetdialogStep=data.dialogStep;
  }

  ngOnInit() {
   
    if (this.GetdialogStep>0){
      this.setDialogStep(this.GetdialogStep);
    }
    else{
      this.dialogStep = this.GetdialogStep
    }
    this.spin=false;
  }
  setDialogStep(step: number): void {


    let searchCriteria = [];
    searchCriteria['OwnerID'] = step == 5 ? this.feedback.employee.id : this.feedback.product.manufacturer.id;
    searchCriteria['distribution'] = 5;
    searchCriteria['OwnerType'] = step;
    this.contactService.getContactsByOwner(searchCriteria)
      .then(response => {
        this.contacts = response;
      }).then(x => {
        this.generalService.getFilesByEmployee(this.feedback.employee.id)
          .then(response => this.files = response).then(x => {
      
            
            if (this.feedback.inttreatmentFactor <= 5) {
              this.generalService.getApplication(this.feedback.Applicationid)
                .then(response => {
                  console.log(response);
                  
                  this.application = response;
                }).then(x =>{

                this.Repeat = true, this.dialogStep = step
                })
            }
            else {

              this.dialogStep = step;


            }


          })
      });
    ;


    // this.dialogStep = step;
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
    this.dialogRef.close();
  }
   onCloseClickedRepeat(): void {
    this.dialogRef.close();
  }
}
