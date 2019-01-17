import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { NgForm } from '@angular/forms';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-attach-reference',
  templateUrl: './attach-reference.component.html',
  animations: [
  trigger('fade', [
    state('inactive', style({
      display: 'none',
      opacity: '0'
    })),
    state('active', style({
      display: 'block',
      opacity: '1'
    })),
    transition('active => inactive', animate('0ms ease-in')),
    transition('inactive => active', animate('300ms ease-in'))
  ])
],
})
export class AttachReferenceComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public processService: ProcessService,
              private dialogRef: MatDialogRef<AttachReferenceComponent>) { }
  uploadedFile: File;
  typeDoc: string;
  hasServerError: boolean;
  message: string;

  ngOnInit() {
  }
  submit(form: NgForm): void {
    this.hasServerError = false;
    if (this.uploadedFile) {
      this.processService.uploadRef(this.uploadedFile, this.data.file_id).then(response => {
        if (response['message'] === 'success') {
          this.hasServerError = true;
          this.dialogRef.close();
        } else {
            this.message = 'ארעה שגיאה';
        }
      });
    } else {
      this.hasServerError = true;
      this.message = 'לא נבחר קובץ';
    }
  }
}
