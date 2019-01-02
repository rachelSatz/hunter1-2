import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProcessStatus, ProcessType } from 'app/shared/_models/process.model';
import { MONTHS } from 'app/shared/_const/months';
import { Subscription } from 'rxjs';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';

@Component({
  selector: 'app-process-table',
  templateUrl: './process-table.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './process-table.component.css']
})
export class ProcessTableComponent extends DataTableComponent implements OnInit, OnDestroy {

  processStatus = ProcessStatus;
  processType = ProcessType;
  year = (new Date()).getFullYear();
  years = [ this.year, (this.year - 1) , (this.year - 2), (this.year - 3)];
  months = MONTHS;
  sub = new Subscription;


  readonly headers: DataTableHeader[] =  [
    { column: 'process_name', label: 'שם תהליך' }, { column: 'process_number', label: 'מספר תהליך' },
    { column: 'type', label: 'סוג תהליך' },
    { column: 'employer_name', label: 'שם מעסיק' }, { column: 'employer_name', label: 'שם מחלקה' },
    { column: 'month', label: 'חודש' }, {column: 'year', label: 'שנה' },
    { column: 'amount', label: 'סכום' }, { column: 'status', label: 'סטטוס שידור' }
    , { column: 'download', label: 'הורדה' }
  ];

  constructor(route: ActivatedRoute, private processService: ProcessService,
              private selectUnit: SelectUnitService) {
    super(route);
    this.searchCriteria['year'] = this.year;
  }

  ngOnInit() {
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => this.fetchItems()));

    super.ngOnInit();
  }

  fetchItems(): void {
    const organizationId = this.selectUnit.currentOrganizationID;
    const employerId = this.selectUnit.currentEmployerID;

    if (organizationId) {
      this.searchCriteria['year'] = 2018;
      this.searchCriteria['departmentId'] = employerId;
      this.searchCriteria['employerId'] = employerId;
      this.searchCriteria['organizationId'] = organizationId;
      this.processService.getProcesses(this.searchCriteria).then(response => this.setItems(response));
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.sub.unsubscribe();
  }

}
