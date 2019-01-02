import { Component, OnInit } from '@angular/core';
import { ProcessService } from 'app/shared/_services/http/process.service';
import {NgForm} from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';
import { SelectDepComponent } from './select-dep/select-dep.component';
import { Month } from '../../../shared/_const/month-bd-select';


@Component({
  selector: 'app-process-data',
  templateUrl: './process-data.component.html',
  styleUrls: ['./process-data.component.css'],
  providers: [ProcessService]
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

  constructor(private processService: ProcessService, private dialog: MatDialog) {}

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
  uploadFile() {
    this.spin = true;
    this.processService.uploadProcess(this.processFile).then(response => {
      console.log(response);
    });
  }

  next(index, form: NgForm) {
   if (form.value.year && form.value.month) {
     this.pageNumber += index;
     console.log(this.pageNumber);
   }
   if (index === -1) {
     this.pageNumber = 1;

   }

  }

  openDialog() {
    this.dialog.open(SelectDepComponent, {
      height: '120px',
      width: '600px'
    });

    //
    // openFormDialog(): void {
    //   const dialog = this.dialog.open(FormComponent, {
    //     data: { }
    //   });
    //
    //   this.sub.add(dialog.afterClosed().subscribe(created => {
    //
    //   }));
    // }
  }
}
