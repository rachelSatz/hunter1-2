import { Component, OnInit } from '@angular/core';
import { fade } from '../../../../../app/shared/_animations/animation';

@Component({
  selector: 'app-employers-finance-excel',
  templateUrl: './employers-finance-excel.component.html',
  styles: ['::ng-deep .dialog-header {direction: rtl} '],
  animations: [fade]
})
export class EmployersFinanceExcelComponent implements OnInit {

   uploadedFile: File;
   typeDoc: string;
   message: string;
   hasServerError: boolean;
   exampleFileType = 'xlsx';
   exampleFileName = 'employersFinanceExample.xlsx';
  constructor() { }

  ngOnInit() {
     this.typeDoc = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';
  }


}
