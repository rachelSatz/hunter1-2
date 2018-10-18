import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { CompensationService } from 'app/shared/_services/http/compensation.service';

import { ContactService } from 'app/shared/_services/http/contact.service';
import { HelpersService } from 'app/shared/_services/helpers.service';

import { Compensation } from 'app/shared/_models/compensation.model';

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

  constructor(@Inject(MAT_DIALOG_DATA) public compensation: Compensation, private dialog: MatDialog,
              private dialogRef: MatDialogRef<SendToComponent>, private compensationService: CompensationService,
              private contactService: ContactService, private helpers: HelpersService) {}


  ngOnInit() {
    this.helpers.setPageSpinner(true);
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getEmployerContacts(this.compensation).then(types => {
      for (const i in types) {
        if (types[i] != null) {
          this.contacts.push({ id: types[i].id, name: [types[i].name] });
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
}
