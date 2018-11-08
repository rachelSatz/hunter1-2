import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import { MONTHS } from '../../../shared/_const/months';




@Component({
  selector: 'app-process-upload',
  templateUrl: './process-upload.component.html',
  styleUrls: ['./process-upload.component.css']
})
export class ProcessUploadComponent implements OnInit {
  public files: any[] = [];
  spin: false ;
  paymentsFile: File;
  fileTypeError = false;
  noFileError = false;
  activeUploadStep: number;

  constructor() { }

  ngOnInit() {
    this.activeUploadStep = 2;
  }

  removeFile(): void {
    this.paymentsFile = null;
  }

  GetFileFromDrop(event) {
    console.log(event);
    this.files = event.files;
    if (this.files == null || this.files.length === 0) {
      return;
    }
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as any;
        fileEntry.file((file: File) =>
          this.setFile(file));

      }
    }
  }

  setFile(file: File) {

  }

}
