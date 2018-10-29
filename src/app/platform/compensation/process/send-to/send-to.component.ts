import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormControl, NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatChipInputEvent, MatDialog, MatDialogRef, MatAutocompleteSelectedEvent,
  MatAutocomplete} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { CompensationService } from 'app/shared/_services/http/compensation.service';

import { ContactService } from 'app/shared/_services/http/contact.service';
import { HelpersService } from 'app/shared/_services/helpers.service';

import { Compensation } from 'app/shared/_models/compensation.model';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


export interface Email {
  name: string;
}

@Component({
  selector: 'app-send-to',
  templateUrl: './send-to.component.html',
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: '0',
      })),
      state('active', style({
        display: '*',
        opacity: '1',
      })),
      transition('active => inactive', animate('200ms')),
      transition('inactive => active', animate('200ms'))
    ])
  ]
})

export class SendToComponent implements OnInit {
  contacts = [];

  hasServerError: boolean;

  selectablecontact = true;
  removablecontact = true;
  addOnBlurContact = true;
  contactCtrl = new FormControl();
  filteredContacts: Observable<string[]>;
  contacts1: string[] = [];
  allContacts: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  Emails: Email[] = [

  ];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(@Inject(MAT_DIALOG_DATA) public compensation: Compensation, private dialog: MatDialog,
              private dialogRef: MatDialogRef<SendToComponent>, private compensationService: CompensationService,
              private contactService: ContactService, private helpers: HelpersService) {
    this.filteredContacts = this.contactCtrl.valueChanges.pipe(
      startWith(null),
      map((contact: string | null) => contact ? this._filter(contact) : this.allContacts.slice()));

  }


  ngOnInit() {
    this.helpers.setPageSpinner(true);
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getEmployerContacts(this.compensation).then(types => {
      for (const i in types) {
        if (types[i] != null) {
          this.contacts.push({ id: types[i], name: [types[i]] });
          this.allContacts.push(types[i]);
        }
      }

      this.helpers.setPageSpinner(false);
    });

  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;

      this.compensationService.newInquiry(this.compensation.id, 'dfsd', ['ruthw@smarti.co.il'], [3, 4]).then(response => {
      if (response) {
            this.dialogRef.close(this.compensation);
          } else {
            this.hasServerError = true;
          }
        });
      // should be func call to compensation inquiry
      // this.compensationService.updateCompensation(this.compensation).then(response => {
      //   if (response) {
      //     this.dialogRef.close(this.compensation);
      //   } else {
      //     this.hasServerError = true;
      //   }
      // });
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

    // Reset the input value
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


  addContact(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.contacts1.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.contactCtrl.setValue(null);
    }
  }

  removeContact(fruit: string): void {
    const index = this.contacts1.indexOf(fruit);

    if (index >= 0) {
      this.contacts1.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.contacts1.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.contactCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allContacts.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }
}
