import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { ContactFormComponent } from './contact-form/contact-form.component';

import { ContactService } from '../../../shared/_services/http/contact.service';
import { EmployerService } from '../../../shared/_services/http/employer.service';

import { Contact, EntityTypes } from '../../../shared/_models/contact.model';
import { DataTableHeader } from '../../../shared/data-table/classes/data-table-header';
import { GeneralHttpService } from "../../../shared/_services/http/general-http.service";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class ContactsComponent extends DataTableComponent implements OnInit {

  readonly headers: DataTableHeader[] = [
     { column: 'nameEntity', label: 'שם הגורם' },
      { column: 'entityType', label: 'סוג הגורם' },
    { column: 'firstName', label: 'שם פרטי' }, { column: 'lastName', label: 'שם משפחה' },
    { column: 'phone', label: 'טלפון' }, { column: 'mobile', label: 'נייד' },
    { column: 'email', label: 'כתובת מייל' }, { column: 'role', label: 'תפקיד' }
  ];

  typeEntities: any[];

  constructor(protected route: ActivatedRoute, private dialog: MatDialog, private contactService: ContactService,
              private employerService: EmployerService, private generalService: GeneralHttpService) {
    super(route);
  }


  fetchItems(): void {
    this.contactService.getContacts(this.searchCriteria).then(response => this.setItems(response));
  }
 GetentityType(key: number): string {
    
     if(key==0){
        return "מעסיק";
     }
   else if(key==1){
       return "סוכן";
     }
  else if(key==3){
       return "יצרן";
     }
  return "";
 }
  openFormDialog(item?: Contact): void {
    const contact = item ? item : new Contact;

    const dialogRef = this.dialog.open(ContactFormComponent, {
      width: '800px',
      data: {
        contact: contact
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactService.storeContact(result)
        .then(response => {
            if (response['id']) {
              this.setNewItem(response);
            }
        });
      }
    });
  }

  setEntityType(): void {
    switch (this.searchCriteria['entityType']) {
      case 0:
        this.employerService.getEmployers().then(response => this.typeEntities = response);
      case 3:
        this.generalService.getManufacturers().then(response => this.typeEntities = response);
      case 1:
        this.generalService.getAgents().then(response => this.typeEntities = response);
        

    }

    this.search();
  }
}
