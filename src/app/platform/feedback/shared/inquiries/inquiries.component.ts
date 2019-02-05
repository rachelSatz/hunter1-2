import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {GeneralHttpService} from '../../../../shared/_services/http/general-http.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-inquiries',
  templateUrl: './inquiries.component.html'
})
export class InquiriesComponent implements OnInit {
  inquiries = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialog: MatDialog,
              private generalService: GeneralHttpService) { }

  ngOnInit() {
    this.generalService.getInquiries(this.data.id, this.data.contentType).then(response =>
      this.inquiries = response
    );
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

}
