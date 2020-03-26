import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';
import {EmployerService} from '../../../shared/_services/http/employer.service';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-employer-employees',
  templateUrl: './employer-employees.component.html',
  styleUrls: ['./employer-employees.component.css']
})
export class EmployerEmployeesComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  endDate;
  startDate;
  departmentsIds;
  sub = new Subscription;
  readonly columns =  [
    { name: 'organization_name', label: 'ארגון', searchable: false },
    { name: 'employer_name', label: 'מעסיק' , searchable: false},
    { name: 'employer_identifier', label: 'מספר ח"פ' , searchable: false},
    { name: 'operator_name', label: 'מנהל תיק', searchOptions: {labels: [] }},
    { name: 'employee_no_product', label: 'תעודת זהות לא כולל מוצרים' , searchable: false},
    { name: 'employee_product', label: 'תעודת זהות כולל מוצרים' , searchable: false}
  ];
  constructor(private employerService: EmployerService,
              private _location: Location,
              private router: Router,
              protected route: ActivatedRoute,
              private selectUnit: SelectUnitService) { }

  ngOnInit() {
    this.departmentsIds = this.route.snapshot.queryParams['departmentsIds'];
    this.startDate = this.route.snapshot.queryParams['startDate'];
    this.endDate = this.route.snapshot.queryParams['endDate'];
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
    this.dataTable.criteria.filters['departmentsIds'] = this.departmentsIds;
    this.dataTable.criteria.filters['startDate'] = this.startDate;
    this.dataTable.criteria.filters['endDate'] = this.endDate;

    this.employerService.getEmployeesCountDetails(this.dataTable.criteria).then(
      response => this.setResponse(response));
  }

  setResponse(response: any): void {
    this.dataTable.setItems(response);
  }

}
