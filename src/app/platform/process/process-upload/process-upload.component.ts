import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';


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


  constructor(private router: Router) { }

  ngOnInit() {
    console.log(this.router.url);
  }

  setHeaderColor(): number {
    const currentRoute = (this.router.url).split('/');

    if (currentRoute[4] === 'payment') {
      return 2;
    }

    if (currentRoute[4] === 'broadcast') {
      return 3;
    }
  }


}
