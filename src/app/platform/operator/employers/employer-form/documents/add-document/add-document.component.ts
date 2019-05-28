import { NgForm } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { fade } from 'app/shared/_animations/animation';
import { DocumentTypes } from 'app/shared/_models/document.model';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { DocumentService } from 'app/shared/_services/http/document.service';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  animations: [ fade ]
})
export class AddDocumentComponent implements OnInit {

  uploadedFile: File;
  description = '';
  hasServerError;
  organizations = [];
  employers = [];
  employerId: number;
  organizationId: number;
  documentType: number;
  documentTypes = Object.keys(DocumentTypes).map(function(e) {
    return { id: e, name: DocumentTypes[e] };
  });

  constructor(public dialogRef: MatDialogRef<AddDocumentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private selectUnit: SelectUnitService,
              private documentService: DocumentService) { }

  ngOnInit() {
    this.organizations = this.selectUnit.getOrganization();
  }


  submit(form: NgForm) {
    if (form.valid && this.uploadedFile) {
      if (this.data) {
        this.employerId = this.selectUnit.currentEmployerID;
      }

      this.documentService.uploadFile(this.employerId, this.description, this.uploadedFile, this.documentType)
        .then(response => {
          if (!response) {
            this.hasServerError = true;

          } else {
            this.dialogRef.close(true);
          }
        });
    }
  }

  loadEmployers(organizationID: number): void {
    this.employers = this.organizations.find(o => o.id === organizationID).employer
    this.employers.sort((a, b) => a.id - b.id);
  }

  close() {
    this.dialogRef.close();
  }

}
