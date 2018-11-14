import { Component, OnInit } from '@angular/core';
import { ProcessService } from 'app/shared/_services/http/process.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  public files: any[] = [];
  spin: boolean ;
  processFile: File;
  fileTypeError = false;
  constructor(private  processService: ProcessService) { }

  ngOnInit() {
  }


  GetFileFromDrop(event) {
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

  uploadFile(file: File) {
    this.spin = true;
    this.processService.uploadProcess(file).then(response => {
      console.log(response);
    });
  }
}
