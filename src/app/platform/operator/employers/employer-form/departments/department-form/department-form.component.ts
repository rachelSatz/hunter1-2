import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { BankAccountComponent } from './bank-account/bank-account.component';
import { Department } from 'app/shared/_models/department.model';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.css']
})
export class DepartmentFormComponent implements OnInit {

  department = new Department();

  constructor(private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    if (this.route.snapshot.data.department) {
      this.department = this.route.snapshot.data.department;
    }
  }

  openBankAccountDialog(data: object, ids: object): void {
    this.dialog.open(BankAccountComponent, {
      // data: {'banks': data, 'ids': ids },
      width: '655px',
      panelClass: 'dialog-file'
    });
  }

}
