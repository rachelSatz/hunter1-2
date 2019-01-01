import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-process-upload',
  templateUrl: './process-upload.component.html',
  styleUrls: ['./process-upload.component.css']
})

export class ProcessUploadComponent implements OnInit {

  activeUploadStep = 1;

  public files: any[] = [];
  paymentsFile: File;
  fileTypeError = false;
  noFileError = false;


  constructor() { }

  ngOnInit() {

  }



}
