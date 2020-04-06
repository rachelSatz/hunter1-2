import { NgForm } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { ActivatedRoute } from '@angular/router';
import {Component, Inject, OnInit} from '@angular/core';
import { fade } from 'app/shared/_animations/animation';
import {  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Compensation } from 'app/shared/_models/compensation.model';
import { CompensationService } from 'app/shared/_services/http/compensation.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  styles: ['.displayNone { display: none}' , '.table { border: none }'],
  animations: [ fade ]
})

export class DetailsComponent implements OnInit {


  public files: any[] = [];
  uploadedFile: File[];
  spin: boolean;
  hasServerError: boolean;

  constructor(protected route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public compensation: Compensation,
              private dialogRef: MatDialogRef<DetailsComponent>,
              private compensationService: CompensationService) {
  }

  ngOnInit() {
  }

  submit(form: NgForm): void {
    if (form.valid) {
      this.hasServerError = false;
      this.compensationService.updateCompensation(this.compensation, this.uploadedFile).then(response => {
        if (response) {
          this.dialogRef.close(this.compensation);
        } else {
          this.hasServerError = true;
        }
      });
    }
  }

  downloadFile(fileName: string, type: string): void {
    this.spin = true;
    this.compensationService.downloadFile(this.compensation.id, fileName).then(response => {
      const byteCharacters = atob(response['data']);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application/' + type});
      FileSaver.saveAs(blob, fileName);
      this.spin = false;
    });
  }

  deleteFile(fileName: string): void {
      this.hasServerError = false;
      this.compensationService.deleteFile(this.compensation.id, fileName).then(response => {
        if (response) {
          this.compensation.files.items = response['file_list'];
          this.dialogRef.close(this.compensation);
        } else {
          this.hasServerError = true;
        }
      });
  }

  getFileFromDrop(event) {
    if (event.files != null && event.files.length > 0) {
      for (const droppedFile of event.files) {
        if (droppedFile['fileEntry'].isFile) {
          const fileEntry = droppedFile['fileEntry'] as any;
          fileEntry.file((file: File) =>  this.setFile(file));
        }
      }
    }
  }


  setFile(file: File) {
    if (this.uploadedFile === undefined) {
      this.uploadedFile = [];
    }
    this.uploadedFile.push(file);
  }

}
