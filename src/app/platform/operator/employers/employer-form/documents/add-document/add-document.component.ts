import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { DocumentService } from 'app/shared/_services/http/document.service';
import { fade } from 'app/shared/_animations/animation';
import { HelpersService } from 'app/shared/_services/helpers.service';
import {NgForm} from '@angular/forms';

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
  organizationId : number;

  constructor(public dialogRef: MatDialogRef<AddDocumentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private selectUnit: SelectUnitService,
              private documentService: DocumentService,
              private helpers: HelpersService) { }

  ngOnInit() {
    this.organizations = this.helpers.organizations;

  }


  submit(form: NgForm) {
    if(form.valid && this.uploadedFile) {
      if (this.data)
        this.employerId = this.selectUnit.currentEmployerID;

      this.documentService.uploadFile(this.employerId, this.description, this.uploadedFile)
        .then(response => {
          if (!response) {
            this.hasServerError = true;
          }
        });
      this.dialogRef.close(true);
    }
  }

  loadEmployers(organizationID: number): void {
    this.employers = this.helpers.organizations.find(o => o.id === organizationID).employer
    this.employers.sort((a, b) => a.id - b.id);
  }

  close() {
    this.dialogRef.close();
  }

}
