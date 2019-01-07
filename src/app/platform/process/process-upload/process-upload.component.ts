import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {getRelativePath} from 'tslint/lib/configuration';


@Component({
  selector: 'app-process-upload',
  templateUrl: './process-upload.component.html',
  styleUrls: ['./process-upload.component.css']
})

export class ProcessUploadComponent implements OnInit {

  activeUploadStep = 1;

  public files: any[] = [];

  constructor(public router: Router, protected route: ActivatedRoute) { }

  ngOnInit() {

  }

  setRouterLink(route: string , index: number): void {
    this.activeUploadStep = index;
    this.router.navigate( [route], { relativeTo: this.route});
  }



}
