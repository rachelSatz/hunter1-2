import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';
import {EmployerService} from '../../../shared/_services/http/employer.service';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ReportFilters} from '../../../shared/_models/report_manage';
import {fade} from '../../../shared/_animations/animation';

@Component({
  selector: 'app-employer-employees',
  templateUrl: './employer-employees.component.html',
  styleUrls: ['./employer-employees.component.css'],
  animations: [fade]
})
export class EmployerEmployeesComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  tab = 1;
  reportsFilters = new ReportFilters;
  sub = new Subscription;
  organizations;
  employers;
  readonly columns =  [
    { name: 'organization_name', label: 'ארגון', searchable: false },
    { name: 'employer_name', label: 'מעסיק' , searchable: false},
    { name: 'employer_identifier', label: 'מספר ח"פ' , searchable: false},
    { name: 'operator_name', label: 'מנהל תיק', searchable: false},
    { name: 'employee_no_product', label: 'כמות עובדים ' , searchable: false},
    { name: 'employee_product', label: 'תעודות זהות שנסלקו' , searchable: false}
  ];
  readonly columnsOrganizations =  [
    { name: 'organization_name', label: 'ארגון', searchable: false },
    { name: 'operator_name', label: 'מנהל תיק', searchable: false},
    { name: 'employee_no_product', label: 'כמות עובדים ' , searchable: false},
    { name: 'employee_product', label: 'תעודות זהות שנסלקו' , searchable: false}
  ];
  constructor(private employerService: EmployerService,
              private _location: Location,
              private router: Router,
              protected route: ActivatedRoute,
              private selectUnit: SelectUnitService) { }

  ngOnInit() {
    this.reportsFilters = this.selectUnit.getReportFilters();
  }

  previous(): void {
    this._location.back();
  }

  changeTab(tab) {
    this.tab = tab;
    const item = tab === 1 ? this.employers : this.organizations;
    this.dataTable.setItems(item);
  }

  fetchItems() {
    if (this.reportsFilters) {
      this.dataTable.criteria.filters['employerId'] = this.reportsFilters.employerId;
      this.dataTable.criteria.filters['operatorId'] = this.reportsFilters.operatorId;
      this.dataTable.criteria.filters['organizationId'] = this.reportsFilters.organizationId;
      this.dataTable.criteria.filters['projectId'] = this.reportsFilters.projectId;
      this.dataTable.criteria.filters['status'] = 'active';
      this.dataTable.criteria.filters['salaryMonth'] = this.reportsFilters.salaryMonth;
      this.dataTable.criteria.filters['startDate'] = this.reportsFilters.startDate;
      this.dataTable.criteria.filters['endDate'] = this.reportsFilters.endDate;
    }
    this.dataTable.criteria.filters['no_limit'] = false;
    this.employerService.getEmployeesCountDetails(this.dataTable.criteria).then(
      response => this.setResponse(response));
    // this.selectUnit.clearReportFilters();
  }

  setResponse(response: any): void {
    this.dataTable.setItems(response['employers']);
    this.employers = response['employers'];
    this.organizations = response['organizations'];
  }

}
