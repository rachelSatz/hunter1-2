import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { DocumentService } from 'app/shared/_services/http/document.service';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  animations: [ fade ]
})
export class AddDocumentComponent implements OnInit {

  uploadedFile: File;
  description: string;
  hasServerError;

  constructor(public dialogRef: MatDialogRef<AddDocumentComponent>, private selectUnit: SelectUnitService,
              private documentService: DocumentService) { }

  ngOnInit() {
  }

  submit() {
    console.log(this.description);
    console.log(this.uploadedFile);
    this.documentService.uploadFile(this.selectUnit.currentEmployerID, this.description, this.uploadedFile)
      .then(response => {
        if (!response) {
          this.hasServerError = true;
        }
      });
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close();
  }

}
