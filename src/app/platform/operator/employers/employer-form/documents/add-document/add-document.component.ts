import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html'
})
export class AddDocumentComponent implements OnInit {

  uploadedFile: File;

  constructor() { }

  ngOnInit() {
    // this.compensationService.uploadExcelEmployees(this.uploadedFile, this.data.departmentId).then(response => {})
  }

}
