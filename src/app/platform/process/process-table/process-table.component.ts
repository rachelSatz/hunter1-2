import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import {ProcessService} from '../../../shared/_services/http/process.service';

@Component({
  selector: 'app-process-table',
  templateUrl: './process-table.component.html',
  styleUrls: ['./process-table.component.css']
})
export class ProcessTableComponent extends DataTableComponent{

  readonly headers: DataTableHeader[] =  [
    { column: 'process_name', label: 'שם תהליך' }, { column: 'process_number', label: 'מספר תהליך' },
    { column: 'employer_name', label: 'שם מעסיק' }, { column: 'month', label: 'חודש' },
    { column: 'code', label: 'קוד' }, { column: 'amount', label: 'סכום' }, { column: 'status', label: 'סטטוס שידור' }
    , { column: 'download', label: 'הורדה' }
  ];

  constructor(route: ActivatedRoute, private processService: ProcessService) {
    super(route);
  }

  fetchItems(): void {
    this.processService.getProcesses().then(response => this.setItems(response));
  }



}
