import { Component } from '@angular/core';

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html'
})
export class AddFileComponent {

  uploadedFile: File;
  files = [];

  submit(): void {

  }
}

