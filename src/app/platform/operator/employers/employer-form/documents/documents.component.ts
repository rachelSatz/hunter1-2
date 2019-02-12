import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataTableComponent} from '../../../../../shared/data-table/data-table.component';
import {ActivatedRoute} from '@angular/router';
import {DepartmentService} from '../../../../../shared/_services/http/department.service';
import {SelectUnitService} from '../../../../../shared/_services/select-unit.service';
import {DataTableHeader} from '../../../../../shared/data-table/classes/data-table-header';
import * as FileSaver from 'file-saver';
import {DocumentService} from '../../../../../shared/_services/http/document.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent extends DataTableComponent implements OnInit , OnDestroy {


  constructor(route: ActivatedRoute,
    private documentService: DocumentService,
    private selectUnit: SelectUnitService) {
    super(route);
    this.paginationData.limit = 5;
  }

readonly headers: DataTableHeader[] =  [
    { column: 'filename', label: 'שם הקובץ' },
    { column: 'date', label: 'תאריך העלאה' },
    { column: 'type', label: 'סוג' },
  ];

  ngOnInit() {

  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  // file(rowId: number, type: string): any {
  //   this.compensationService.downloadPdfFile(rowId).then(response => {
  //     if (response) {
  //       const byteCharacters = atob(response);
  //       const byteNumbers = new Array(byteCharacters.length);
  //       console.log(byteCharacters.length);
  //       for (let i = 0; i < byteCharacters.length; i++) {
  //         byteNumbers[i] = byteCharacters.charCodeAt(i);
  //       }
  //       const byteArray = new Uint8Array(byteNumbers);
  //       const blob = new Blob([byteArray], {type: 'application/pdf'});
  //       const fileURL = URL.createObjectURL(blob);
  //       if (type === 'show') {
  //         window.open(fileURL);
  //       } else {
  //         FileSaver.saveAs(blob, 'Compensation-Request-Reply.pdf');
  //       }
  //     }else {
  //       type =  type === 'show' ?  'להציג' : 'להוריד';
  //       this.notificationService.error('', ' אין אפשרות ' + type +  ' קובץ ');
  //     }
  //   });
  // }
}
