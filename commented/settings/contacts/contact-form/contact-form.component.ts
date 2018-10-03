import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { EmployerService } from '../../../../shared/_services/http/employer.service';
import { ContactService } from '../../../../shared/_services/http/contact.service';

import { Contact } from '../../../../shared/_models/contact.model';
import { GeneralHttpService } from "../../../../shared/_services/http/general-http.service";
import { selectItem } from "../../../../shared/_models/selectItem.model";

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html'
})
export class ContactFormComponent implements OnInit {

  contact: Contact;
  selectedContactIds: number[];
  isSubmitting: boolean;
  typeEntities: any[];
  myOptions:selectItem[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ContactFormComponent>,
              private employerService: EmployerService, private contactService: ContactService,private generalService: GeneralHttpService) {
    this.contact = data.contact;
  }

  ngOnInit() {
    debugger;
    if (this.contact.id>0) {
      this.setEntityType();
      console.log("entityID",this.contact.entityTypeId);
        console.log("typeEntities",this.typeEntities);
          console.log("contact",this.contact);
    }
   else{
     if(this.contact.entityTypeId>0){
         this.setEntityType();
          console.log("entityID",this.contact.entityTypeId);
        console.log("typeEntities",this.typeEntities);
          console.log("contact",this.contact);
     }
      
      
    
   }

  }

  submit(isValid: boolean): void {
debugger;
    if (isValid) {
      this.isSubmitting = true;
      this.contact.selectOption = this.selectedContactIds;
       setTimeout(() => this.dialogRef.close(this.contact), 3000);
    }
  }

GetOptions(entityType:number){
  this.myOptions=[];
     let  Option: selectItem = new selectItem();
  Option.value = 5;
   Option.name="פניה ברמת רשומה";
   this.myOptions.push(Option);
    let  Option1: selectItem = new selectItem();
  Option1.value = 7;
   Option1.name="פניה ברמת קובץ";
      this.myOptions.push(Option1);
      if(entityType==0){
            let  Option2: selectItem = new selectItem();
  Option2.value = 9;
   Option2.name="קבלת קובץ תנועות";
         this.myOptions.push(Option2);
      }
    return  this.myOptions;
}
   
getSelectedOptionText(Identity: string) :void{
  debugger;
    this.contact.nameEntity= this.typeEntities.filter(n=> n.id === Identity)[0].name;                          
}

  setEntityType(): void {
    console.log("setEntityType",this.contact.entityType);
    debugger;
    this.myOptions = this.GetOptions(this.contact.entityType);
    switch (this.contact.entityType) {
      case 0:
        this.employerService.getEmployers().then(response => this.typeEntities = response);
      case 3:
        this.generalService.getManufacturers().then(response => this.typeEntities = response);
      case 1:
        this.generalService.getAgents().then(response => this.typeEntities = response);
    }
  }
}
