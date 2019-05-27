import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';

import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-inquiries',
  templateUrl: './inquiries.component.html',
  animations: [ fade ]
})
export class InquiriesComponent implements OnInit {
  inquiries = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<InquiriesComponent>,
              private dialog: MatDialog,
              private generalService: GeneralHttpService) { }

  ngOnInit() {
    this.inquiries =  this.data.inquiries;
  }

  downloadFilesInquirie(id: number): void {
    this.generalService.downloadFilesInquirie(id, this.data.contentType).then(response => {
      response.forEach(item => {
        const byteCharacters = atob(item.blob);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'application/' + item.type});
        FileSaver.saveAs(blob,  item.name);
      });
    });
  }

  close() {
    this.dialogRef.close();
  }
}
