import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { fade } from 'app/shared/_animations/animation';
import { ProcessService } from 'app/shared/_services/http/process.service';

@Component({
  selector: 'app-attach-reference',
  templateUrl: './attach-reference.component.html',
  animations: [ fade ]
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
