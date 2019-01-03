import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Month } from '../../../../shared/_const/month-bd-select';
import {Router} from '@angular/router';


@Component({
  selector: 'app-process-data',
  templateUrl: './process-data.component.html',
  styleUrls: ['./process-data.component.css'],
})
export class ProcessDataComponent implements OnInit {

  sub = new Subscription;
  pageNumber = 1;

  readonly month = Month;

  readonly year = [
    {'id': 1, 'name': '2016'},
    {'id': 2, 'name': '2017'},
    {'id': 3, 'name': '2018'},
    {'id': 4, name: '2019'}
  ];

  public files: any[] = [];
  spin: boolean ;
  processFile: File;
  fileTypeError = false;

  constructor(private router: Router) {}

  ngOnInit() {
  }

  getFileFromDrop(event) {
    if (event.files != null && event.files.length > 0) {
      for (const droppedFile of event.files) {
        if (droppedFile['fileEntry'].isFile) {
          const fileEntry = droppedFile['fileEntry'] as any;
          fileEntry.file((file: File) => this.setFile(file));
        }
      }
    }
  }

  setFile(file: File) {
    const ext = file.name.substr(file.name.indexOf('.') + 1);

    if (['xml', 'dat'].indexOf(ext.toLowerCase()) === -1) {
      this.fileTypeError = true;
      return;
    }

    if (this.fileTypeError) {
      this.fileTypeError = false;
    }

    this.processFile = file;
  }

  uploadFile(): void {
    this.router.navigate(['./', 'payment']);
  }

  next(index, form: NgForm) {
   if (form.value.year && form.value.month) {
     this.pageNumber += index;
   }
   if (index === -1) {
     this.pageNumber = 1;
   }
  }
}
