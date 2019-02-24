import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {MAT_DIALOG_DATA, MatChipInputEvent, MatDialog, MatDialogRef,
        MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { FormControl, NgForm } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { Compensation } from 'app/shared/_models/compensation.model';
import { fade } from 'app/shared/_animations/animation';

export interface Contact {
  id: number;
  name: string;
}
export interface Email {
  name: string;
}

@Component({
  selector: 'app-send-to',
  templateUrl: './send-to.component.html',
  animations: [ fade ]
})

export class SendToComponent implements OnInit {
  hasServerError: boolean;
  uploadedFile: File [];
  contactCtrl = new FormControl();
  filteredContacts: Observable<Contact[]>;
  contactsAdd: Contact[] = [];
  comments = '';
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  Emails: Email[] = [];
  contacts: Contact[] = [];

  @ViewChild('contactInput') contactInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(@Inject(MAT_DIALOG_DATA) public compensation: Compensation, private dialog: MatDialog,
              private dialogRef: MatDialogRef<SendToComponent>, private compensationService: CompensationService,
              private contactService: ContactService, private helpers: HelpersService,
              private generalService: GeneralHttpService) {
    this.filteredContacts = this.contactCtrl.valueChanges.pipe(
      startWith(null),
      map((contact: string | null) => contact ? this._filter(contact) : this.contacts.slice()));
  }

  ngOnInit() {
    this.helpers.setPageSpinner(true);
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getEmployerContacts(this.compensation.company_id, this.compensation.employer_id).then(types => {
      this.contacts = types;
      this.helpers.setPageSpinner(false);
    });
  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      this.generalService.newInquiry(this.compensation.id, this.comments, 'compensation', this.Emails, form.value['contactsAdd'],
        this.uploadedFile).then(response => {
      if (response) {
            this.dialogRef.close(this.compensation);
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
    // Add our fruit
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

  private _filter(value: string): Contact[] {
    console.log(value);
    const filterValue =  value['name'] === undefined ? value.toLowerCase() : value['name'].toLowerCase();

    return this.contacts.filter(contact => contact.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
