import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { CompensationService } from 'app/shared/_services/http/compensation.service';
import * as FileSaver from 'file-saver';
import {Compensation} from '../../../../shared/_models/compensation.model';
import {forEach} from '@angular/router/src/utils/collection';



@Component({
  selector: 'app-inquiries',
  templateUrl: './inquiries.component.html'
})
export class InquiriesComponent implements OnInit {

  inquiries = [];


  constructor(@Inject(MAT_DIALOG_DATA) public compensationID: number, private dialog: MatDialog,
              private compensationService: CompensationService) {
  }

  ngOnInit() {
    this.compensationService.getInquiries(this.compensationID).then(response =>
      this.inquiries = response
    );
  }

  downloadFilesInquirie(id: number): void {
    this.compensationService.downloadFilesInquirie(id).then(response => {
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
