import { Component, OnInit } from '@angular/core';
import {DepartmentService} from '../../../../../../../shared/_services/http/department.service';
import {SelectUnitService} from '../../../../../../../shared/_services/select-unit.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor(public departmentService: DepartmentService,
              public selectUnit: SelectUnitService) { }

  departments = [];

  ngOnInit() {
    this.departmentService.getDepartments(this.selectUnit.currentEmployerID)
      .then(response => this.departments = response.items);
  }

}
