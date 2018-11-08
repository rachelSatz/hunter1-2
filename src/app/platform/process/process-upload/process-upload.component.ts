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
  // HaveNegativeProcess: boolean;
  // contacts: any[];
  // process: any;
  // EmployerID: number = -1;
  // readonly months = MONTHS;
  // readonly currentYear = new Date().getFullYear();
  // employers: any[];
  // paymentsFile: File;
  // selectedUploadMethod: 'xml' | 'manual';
  // public spin = false;
  // fileTypeError = false;
  // noFileError = false;
  // Neg: boolean;
  // activeUploadStep = 1;
  // isPaymentTransferred: boolean;
  //
  // paymentDialogSubscription: Subscription;
  activeUploadStep: number;

  constructor() { }

  ngOnInit() {
    this.activeUploadStep = 2;
  }

  // getTitle(): string {
  //   switch (this.activeUploadStep) {
  //     case 1:
  //       if (this.Neg) {
  //         return 'נתוני החזר כספי';
  //       } else {
  //         return 'נתוני תהליך';
  //       }
  //
  //     case 2:
  //       return 'טעינת נתונים';
  //     case 3:
  //       return 'הקובץ בטעינה';
  //   }
  // }


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
    // if (this.paymentsFile) {
    //   return;
    // }
    // this.process.NegativeProcess = file.name.indexOf('EMPNEG') > -1;
    // const ext = file.name.substr(file.name.indexOf('.') + 1);
    // if (['xml', 'XML', 'dat', 'DAT'].indexOf(ext) === -1) {
    //   this.fileTypeError = true;
    //   return;
    // }
    //
    // if (this.fileTypeError) {
    //   this.fileTypeError = false;
    // }
    //
    // if (this.noFileError) {
    //   this.noFileError = false;
    // }
    //
    // this.paymentsFile = file;
  }

}
