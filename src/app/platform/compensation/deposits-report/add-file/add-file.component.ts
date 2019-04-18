import { ActivatedRoute } from '@angular/router';
import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DocumentService } from 'app/shared/_services/http/document.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { DepositsReportService } from 'app/shared/_services/http/deposits-report.service';
import { NotificationService } from 'app/shared/_services/notification.service';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['../../../../shared/data-table/data-table.component.css'],
  styles: ['table td { word-wrap:break-word }'],
})
export class AddFileComponent implements OnInit {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  uploadedFile: File;
  spin: boolean;
  hasServerError: boolean;
  description: string;

  readonly  columns  = [
    { name: 'file_name', label: 'שם הקובץ' },
    { name: 'file_type', label: 'סוג' },
    { name: 'description', label: 'תאור' },
    { name: 'file_upload', label: 'תאריך העלאה' },
    { name: 'null', label: 'אפשריות' }
  ];

  constructor(protected route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<AddFileComponent>,
              private depositsReportService: DepositsReportService,
              private documentService: DocumentService,
              protected notificationService: NotificationService) {
  }

  ngOnInit() {
    this.depositsReportService.getFile(this.data.id).then(
      response =>  this.dataTable.setItems(response));
  }

  submit(): void {
    if (this.uploadedFile) {
      this.hasServerError = false;
      this.depositsReportService.uploadFile(
        this.description, this.data.id, this.uploadedFile).then(response => {
        if (response) {
          this.dialogRef.close();
        } else {
          this.hasServerError = true;
        }
      });
    }
  }

  downloadFile(item: any, type: string): any {
    this.documentService.downloadFile(item.id, this.data.id).then(response => {
      if (response) {
        const byteCharacters = atob(response['data']);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'application/' + response['ext']});
        const fileURL = URL.createObjectURL(blob);
        if (type === 'show') {
          window.open(fileURL);
        } else {
          FileSaver.saveAs(blob, response['filename']);
        }
      }else {
        type =  type === 'show' ?  'להציג' : 'להוריד';
        this.notificationService.error('', ' אין אפשרות ' + type +  ' קובץ ');
      }
    });
  }

  deleteFile(id: number) {
    this.notificationService.warning('האם ברצונך למחוק את הקובץ?')
      .then(confirmation => {
        if (confirmation.value) {
          this.documentService.deleteFile(id, this.data.id).then(response => {
            if (response) {
              this.ngOnInit();
            }
          });
        }
      });
  }


}
