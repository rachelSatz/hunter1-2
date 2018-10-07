import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import { CompensationService } from 'app/shared/_services/http/compensation.service';

import { Compensation } from 'app/shared/_models/compensation.model';

@Component({
  selector: 'app-send-to',
  templateUrl: './send-to.component.html'
})
export class SendToComponent implements OnInit {

  contacts = [];

  hasServerError: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public compensation: Compensation, private dialog: MatDialog,
              private dialogRef: MatDialogRef<SendToComponent>, private compensationService: CompensationService) {}

  ngOnInit() {
  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;

      this.compensationService.updateCompensation(this.compensation).then(response => {
        if (response) {
          this.dialogRef.close(this.compensation);
        } else {
          this.hasServerError = true;
        }
      });
    }
  }
}
