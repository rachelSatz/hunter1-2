import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';

import { fade } from 'app/shared/_animations/animation';
import { ProcessService } from 'app/shared/_services/http/process.service';

@Component({
  selector: 'app-attach-reference',
  templateUrl: './attach-reference.component.html',
  styleUrls: ['./attach-reference.component.css'],
  animations: [ fade ]
})
export class AttachReferenceComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public processService: ProcessService,
              private dialogRef: MatDialogRef<AttachReferenceComponent>) { }
  typeDoc: string;
  hasServerError: boolean;
  message: string;
  public files: any[] = [];

  ngOnInit() {
  }

  getFileFromDrop(event) {
    if (event.files != null && event.files.length > 0) {
      for (const droppedFile of event.files) {
        if (droppedFile['fileEntry'].isFile) {
          const fileEntry = droppedFile['fileEntry'] as any;
          fileEntry.file((file: File) => this.setFile([file]));
        }
      }
    }
  }

  setFile(files: File[]) {
    this.hasServerError = false;
    for (let i = 0; i < files.length; i++) {
      this.files.push(files[i]);
    }
  }

  submit(): void {
    this.hasServerError = false;
    if (this.files.length > 0) {
      this.processService.uploadsRef(this.files,
        this.data.processId ).then(response => {
        if (response['message'] === 'success') {
          this.hasServerError = true;
          this.dialogRef.close('success');
        } else {
            this.message = 'ארעה שגיאה';
        }
      });
    } else {
      this.hasServerError = true;
      this.message = 'לא נבחר קובץ';
    }
  }

  deleteFile(): void {
    this.hasServerError = false;
    this.files = [];
  }
}
