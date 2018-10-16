import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { CompensationService } from 'app/shared/_services/http/compensation.service';

import { ContactService } from 'app/shared/_services/http/contact.service';

import { Compensation } from 'app/shared/_models/compensation.model';
import {ActivatedRoute} from '@angular/router';
import {DepartmentService} from '../../../shared/_services/http/department.service';
import {ProductService} from '../../../shared/_services/http/product.service';
import {NotificationService} from '../../../shared/_services/notification.service';
import {ProductType} from '../../../shared/_models/product.model';
import {Contact} from '../../../shared/_models/contact.model';

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
              private contactService: ContactService) {}


  ngOnInit() {
  }

  loadContacts(): void {
      this.contactService.getEmployerContact(this.compensation).then(types => {
        for (const i in types) {
          if (types[i] != null) {
            this.contacts.push({ id: types[i], name: [types[i]] });
          }
        }
      });

  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;


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
