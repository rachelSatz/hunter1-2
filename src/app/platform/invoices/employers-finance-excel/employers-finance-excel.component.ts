import { MatDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { SelectUnitService } from '../../../../app/shared/_services/select-unit.service';
import { InvoiceService } from '../../../../app/shared/_services/http/invoice.service';
import { HelpersService } from '../../../../app/shared/_services/helpers.service';
import { fade } from '../../../../app/shared/_animations/animation';

@Component({
  selector: 'app-employers-finance-excel',
  templateUrl: './employers-finance-excel.component.html',
  styles: ['::ng-deep .dialog-header {direction: rtl} '],
  animations: [fade]
})
export class EmployersFinanceExcelComponent implements OnInit {

   uploadedFile: File;
  // files = [];
   typeDoc: string;
   message: string;
   hasServerError: boolean;
  //organizationId: number;
   exampleFileType = 'xlsx';
   exampleFileName = 'employersFinanceExample.xlsx';
  constructor(private dialogRef: MatDialogRef<EmployersFinanceExcelComponent>,
              private selectUnit: SelectUnitService,
              private helpers: HelpersService) { }

  ngOnInit() {
     this.typeDoc = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';
  }


}
