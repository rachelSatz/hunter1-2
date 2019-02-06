import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatChipInputEvent, MatDialog, MatDialogRef, MatAutocompleteSelectedEvent,
  MatAutocomplete} from '@angular/material';
import { GeneralHttpService } from '../../../../shared/_services/http/general-http.service';
import * as FileSaver from 'file-saver';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-inquiries',
  templateUrl: './inquiries.component.html',
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: '0',
      })),
      state('active', style({
        display: '*',
        opacity: '1',
      })),
      transition('active => inactive', animate('200ms')),
      transition('inactive => active', animate('200ms'))
    ])
  ]
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
