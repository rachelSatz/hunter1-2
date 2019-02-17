import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { DocumentService } from 'app/shared/_services/http/document.service';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'block',
        opacity: '0'
      })),
      state('active', style({
        display: 'block',
        opacity: '1'
      })),
      transition('active => inactive', animate('300ms ease-in')),
      transition('inactive => active', animate('300ms ease-in'))
    ])
  ]
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
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}
