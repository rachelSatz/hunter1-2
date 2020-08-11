import { Component, OnInit, ViewChild } from '@angular/core';

import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { User } from 'app/shared/_models/user.model';
import { fade } from 'app/shared/_animations/animation';
import { UserService } from 'app/shared/_services/http/user.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {filter} from 'rxjs/operators/filter';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { ReportsFormComponent } from 'app/platform/finance/invoices/reports-form/reports-form.component';
import { MatDialog } from '@angular/material';
import { RemarksFormComponent } from 'app/platform/finance/invoices/remarks-form/remarks-form.component';
import { UserFormComponent } from 'app/platform/operator/employers/employer-form/comments/user-form/user-form.component';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  animations: [ fade ]
})
export class CommentsComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  user: User;
  comments = [];
  comment: string;
  hasServerError: boolean;
  users: any;
  operators: any;
  // fullName = 'ruth weiss';

  constructor(private generalService: GeneralHttpService, private userSession: UserSessionService,
              private selectUnit: SelectUnitService,
              private userService: UserService,
              private employerService: EmployerService,
              private dialog: MatDialog) { }

  myControl: FormControl = new FormControl();

  options = [
    'One',
    'Two',
    'Three'
  ];

  filteredOptions: Observable<string[]>;

  ngOnInit() {

    this.user = this.userSession.getUser();
    this.generalService.getComments([this.selectUnit.currentEmployerID], 'employer')
      .then(response => this.comments = response);
    this.userService.getUsers().then(response =>
      this.users = response['items']);
    this.employerService.getOperator().then(response => this.operators = response);
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => val.length >= 1 ? this.filter(val) : [])
      );
  }

  onSearchChange(searchValue: string): void {
    console.log(searchValue);
    if (searchValue === '@') {
      this.dialog.open(UserFormComponent, {
        width: '750px'
      });
    }
  }

  filter(val: string): string[] {
    return this.operators.filter(option =>
      option['name'].toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  submit() {
    if (this.comment === undefined) {
      return;
    }

    this.generalService.newComment([this.selectUnit.currentEmployerID], this.comment, 'employer')
      .then(response => {
        if (!response) {
           this.hasServerError = true;
           return;
      }} );

    const curDate = new Date();
    this.hasServerError = false;
    this.comments[this.comments.length] = {id: 1, content: this.comment, updated_at: curDate, created_at: curDate,
                  username: this.user.username};
    this.comment = undefined;
  }

  getShortName(fullName) {
    return fullName.split(' ').map(n => n[0]).join('');
  }
}
