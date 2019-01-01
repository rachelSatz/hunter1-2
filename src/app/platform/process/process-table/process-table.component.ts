import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProcessStatus,  } from 'app/shared/_models/process.model';

@Component({
  selector: 'app-process-table',
  templateUrl: './process-table.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './process-table.component.css']
})
export class ProcessTableComponent extends DataTableComponent {

  processStatus = ProcessStatus

  readonly headers: DataTableHeader[] =  [
    { column: 'process_name', label: 'שם תהליך' }, { column: 'process_number', label: 'מספר תהליך' },
    { column: 'type', label: 'סוג תהליך' },
    { column: 'employer_name', label: 'שם מעסיק' }, { column: 'employer_name', label: 'שם מחלקה' },
    { column: 'month', label: 'חודש' }, {column: 'year', label: 'שנה' },
    { column: 'amount', label: 'סכום' }, { column: 'status', label: 'סטטוס שידור' }
    , { column: 'download', label: 'הורדה' }
  ];

  constructor(route: ActivatedRoute, private processService: ProcessService) {
    super(route);
  }

  fetchItems(): void {
    this.processService.getProcesses(this.searchCriteria).then(response => this.setItems(response));
  }



}
