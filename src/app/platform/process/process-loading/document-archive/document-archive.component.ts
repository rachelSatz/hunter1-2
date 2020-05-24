import { Component, Inject, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { File } from 'app/shared/_models/compensation.model';

@Component({
  selector: 'app-document-archive',
  templateUrl: './document-archive.component.html',
  styleUrls: ['./document-archive.component.css']
})
export class DocumentArchiveComponent implements OnInit {

  files: File[];

  constructor(private processService: ProcessService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.fetchItems();
  }

  fetchItems() {
    this.processService.getRefDocument(this.data.processId).then(response => {
      this.files = response;
    });
  }


  downloadFile(fileName: string): void {
    this.processService.downloadRefDocument(this.data.processId, fileName).then(response => {
      const type = fileName.split('.').pop();
      const byteCharacters = atob(response['blob']);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application/' + type});
      FileSaver.saveAs(blob, fileName);
    });
  }

  deleteFile(fileName: string): void {
    this.processService.deleteRefDocument(this.data.processId, fileName).then(response => {
      if (response['ok']) {
        this.fetchItems();
      }
    });
  }

}
