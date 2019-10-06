import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-file-deposition',
  templateUrl: './file-deposition.component.html',
  animations: [ fade]

})
export class FileDepositionComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<FileDepositionComponent>) { }

  uploadedFile: File;
  files = [];
  hasServerError = false;

  ngOnInit() {
  }

  submit(): void {
    if (this.uploadedFile) {
      this.dialogRef.close(this.uploadedFile);
    } else {
      this.hasServerError = true;
    }
  }

}
