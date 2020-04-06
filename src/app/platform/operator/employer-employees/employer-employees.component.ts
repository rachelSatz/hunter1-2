import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';
import {EmployerService} from '../../../shared/_services/http/employer.service';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ReportFilters} from '../../../shared/_models/report_manage';

@Component({
  selector: 'app-employer-employees',
  templateUrl: './employer-employees.component.html',
  styleUrls: ['./employer-employees.component.css']
})
export class EmployerEmployeesComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  reportsFilters = new ReportFilters;
  sub = new Subscription;
  readonly columns =  [
    { name: 'organization_name', label: 'ארגון', searchable: false },
    { name: 'employer_name', label: 'מעסיק' , searchable: false},
    { name: 'employer_identifier', label: 'מספר ח"פ' , searchable: false},
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

    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
        this.router.navigate([], {
          queryParams: {page: 1},
          relativeTo: this.route
        });
        this.fetchItems();
      }
    ));
  }

  previous(): void {
    this._location.back();
  }

  fetchItems() {
    if (this.reportsFilters) {
      this.dataTable.criteria.filters['employerId'] = this.reportsFilters.employerId;
      this.dataTable.criteria.filters['operatorId'] = this.reportsFilters.operatorId;
      this.dataTable.criteria.filters['organizationId'] = this.reportsFilters.organizationId;
      this.dataTable.criteria.filters['projectId'] = this.reportsFilters.projectsId;
      this.dataTable.criteria.filters['status'] = 'active';
      this.dataTable.criteria.filters['startDate'] = this.reportsFilters.startDate;
      this.dataTable.criteria.filters['endDate'] = this.reportsFilters.endDate;
    }
    this.employerService.getEmployeesCountDetails(this.dataTable.criteria).then(
      response => this.setResponse(response));
    this.selectUnit.clearReportFilters();
  }

  setResponse(response: any): void {
    this.dataTable.setItems(response);
  }

}
