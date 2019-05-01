import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatChipInputEvent, MatDialog, MatDialogRef } from '@angular/material';
import { NgForm} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { fade } from 'app/shared/_animations/animation';
import { AnswerManufacturer } from '../../_models/compensation.model';


export interface Contact {
  id: number;
  name: string;
}
export interface Email {
  name: string;
}

@Component({
  selector: 'app-inquiry-form',
  templateUrl: './inquiry-form.component.html',
  animations: [ fade ]
})
export class InquiryFormComponent implements OnInit {
  hasServerError: boolean;
  uploadedFile: File [];
  contactsAdd: Contact[] = [];
  comments = '';
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  Emails: Email[] = [];
  contacts: Contact[] = [];
  answer = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
              private dialogRef: MatDialogRef<InquiryFormComponent>,
              private contactService: ContactService, private helpers: HelpersService,
              private generalService: GeneralHttpService) { }

  ngOnInit() {

    this.comments = this.data.error_details;
    if ( this.data.feedback_level === 'record'  &&
      this.data.ans_manuf !== null &&
      this.data.ans_manuf !== '') {
      const lstAnswer =  this.data.ans_manuf.split(',');
      this.answer = Object.keys(AnswerManufacturer).map(function (e) {
        if (lstAnswer.some(a => a === AnswerManufacturer[e])) {
          return e;
        }
      });
      this.answer = this.answer.filter(a =>   a !== undefined );

      if ( this.answer !== []) {
        const comment =  this.answer.join(', ');
        this.comments = this.comments + ' ' + comment;
      }
    }

    this.helpers.setPageSpinner(true);
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getEmployerContacts(this.data.companyId, this.data.employerId).then(types => {
      this.contacts = types;
      this.helpers.setPageSpinner(false);
    });
  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      this.generalService.newInquiry(this.data.id, this.comments, this.data.contentType, this.Emails, form.value['contactsAdd'],
        this.data.employerId, this.data.file_name, this.data.product_code, this.data.product_name, this.data.product_type,
        this.data.employee_id, this.data.employee_name,
        this.uploadedFile).then(response => {
        if (response) {
          this.dialogRef.close(this.data);
        } else {
          this.hasServerError = true;
        }
      });
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const validEmailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ((value || '').trim()) {
      if (validEmailRegEx.test(value.trim())) {
        this.Emails.push({name: value.trim()});
      }
    }

    if (input && validEmailRegEx.test(value.trim())) {
      input.value = '';
    }
  }

  remove(fruit: Email): void {
    const index = this.Emails.indexOf(fruit);

    if (index >= 0) {
      this.Emails.splice(index, 1);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
