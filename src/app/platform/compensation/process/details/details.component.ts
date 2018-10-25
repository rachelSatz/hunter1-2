import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { AddFileComponent } from '../add-file/add-file.component';

import { CompensationService } from 'app/shared/_services/http/compensation.service';

import { Compensation } from 'app/shared/_models/compensation.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: '0'
      })),
      state('active', style({
        display: '*',
        opacity: '1'
      })),
      transition('active => inactive', animate('0ms')),
      transition('inactive => active', animate('200ms'))
    ])
  ]
})
export class DetailsComponent {

  uploadedFile: File;

  hasServerError: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public compensation: Compensation,
              private dialogRef: MatDialogRef<DetailsComponent>, private compensationService: CompensationService) {}


  submit(form: NgForm): void {
    if (form.valid) {

      this.hasServerError = false;
      this.compensationService.updateCompensation(this.compensation, this.uploadedFile).then(response => {
        if (response) {
          this.dialogRef.close(this.compensation);
        } else {
          this.hasServerError = true;
        }
      });
    }
  }
}
