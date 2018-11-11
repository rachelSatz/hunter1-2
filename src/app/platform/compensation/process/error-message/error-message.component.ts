import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { CompensationService } from 'app/shared/_services/http/compensation.service';

import { Compensation } from 'app/shared/_models/compensation.model';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styles: ['#errorMessageTable { height: 200px; overflow-y: auto; padding-top: 20px }'],
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
export class ErrorMessageComponent implements OnInit {

  uploadedFile: File;
  files = [];
  hasServerError: boolean;
  code_error: string;
  detail_error: string;


  constructor(@Inject(MAT_DIALOG_DATA) public compensation: Compensation,
              private dialogRef: MatDialogRef<ErrorMessageComponent>, private compensationService: CompensationService) {}

  ngOnInit() {
    this.compensationService.getErrorMessage(this.compensation.id).then(response => {
      this.code_error = response['code_error'];
      this.detail_error = response['detail_error'];
    });
  }

  submit(): void {
    this.hasServerError = false;

  }

}
