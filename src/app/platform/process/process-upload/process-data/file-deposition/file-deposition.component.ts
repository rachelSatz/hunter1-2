import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-file-deposition',
  templateUrl: './file-deposition.component.html'
})
export class FileDepositionComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<FileDepositionComponent>) { }

  uploadedFile: File;
  files = [];

  ngOnInit() {
  }

  submit(): void {
    this.dialogRef.close( this.uploadedFile);
  }

}
