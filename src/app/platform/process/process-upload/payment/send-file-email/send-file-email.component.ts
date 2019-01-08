import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MAT_DIALOG_DATA, MatChipInputEvent, MatDialog, MatDialogRef, MatAutocompleteSelectedEvent,
  MatAutocomplete} from '@angular/material';
import {Email} from '../../../../compensation/process/send-to/send-to.component';

@Component({
  selector: 'app-send-file-email',
  templateUrl: './send-file-email.component.html'
})
export class SendFileEmailComponent implements OnInit {
  defaultEmail = 'mail@smarti.co.il';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectable = true;
  removable = true;
  addOnBlur = true;
  Emails: Email[] = [];


  constructor() { }

  ngOnInit() {
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    const validEmailRegEx =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
}
