import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-process-upload',
  templateUrl: './process-upload.component.html',
  styleUrls: ['./process-upload.component.css']
})

export class ProcessUploadComponent implements OnInit {

  public files: any[] = [];


  constructor(public router: Router, protected route: ActivatedRoute) { }

  ngOnInit() {
  }

  setHeaderColor(): number {
    const currentRoute = (this.router.url).split('/');


    if (currentRoute[4]) {
      if (currentRoute[4].split('?')[0] === 'payment') {
        return 2;
      }
    }

    if (currentRoute[4] === 'broadcast') {
      return 3;
    }
  }
}
