import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-process-upload',
  templateUrl: './process-upload.component.html',
  styleUrls: ['./process-upload.component.css']
})

export class ProcessUploadComponent implements OnInit {

  activeUploadStep = 1;

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
  // spin: false ;
  paymentsFile: File;
  fileTypeError = false;
  noFileError = false;
  // activeUploadStep: number;


  constructor() { }

  ngOnInit() {

  }



}
