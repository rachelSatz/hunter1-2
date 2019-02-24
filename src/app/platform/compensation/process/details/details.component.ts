import {  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import * as FileSaver from 'file-saver';

import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { Compensation } from 'app/shared/_models/compensation.model';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['../../../../shared/data-table/data-table.component.css'],
  styles: ['table td { word-wrap:break-word }', 'table {  table-layout:fixed }'],
  animations: [ fade ]
})
export class DetailsComponent  extends DataTableComponent implements OnInit {

  uploadedFile: File [];
  spin: boolean;
  hasServerError: boolean;

  readonly headers: DataTableHeader[] =  [
    { column: 'file_name', label: 'שם הקובץ' }, { column: 'file_type', label: 'סוג' },
    { column: 'file_upload', label: 'תאריך העלאה' },
    { column: 'null', label: 'אפשריות' }
  ];

  constructor(protected route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public compensation: Compensation,
              private dialogRef: MatDialogRef<DetailsComponent>, private compensationService: CompensationService) {
    super(route);
  }

  ngOnInit() {
      this.setItems(this.compensation.files);
  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      this.compensationService.updateCompensation(this.compensation, this.uploadedFile).then(response => {
        if (response) {
          this.dialogRef.close(this.compensation);
        } else {
          this.hasServerError = true;
        }
      });
    }
  }

  downloadFile(fileName: string, type: string): void {
    this.spin = true;
    this.compensationService.downloadFile(this.compensation.id, fileName).then(response => {
      const byteCharacters = atob(response['data']);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application/' + type});
      FileSaver.saveAs(blob, fileName);
      this.spin = false;
    });
  }

  deleteFile(fileName: string): void {
      this.hasServerError = false;
      this.compensationService.deleteFile(this.compensation.id, fileName).then(response => {
        if (response) {
          this.compensation.files = response['file_list'];
          this.dialogRef.close(this.compensation);
        } else {
          this.hasServerError = true;
        }
      });
  }
}
