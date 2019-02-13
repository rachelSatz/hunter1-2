import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { EmployersResolve } from 'app/shared/_resolves/employers.resolve';

import { Employer } from 'app/shared/_models/employer.model';


@Component({
  selector: 'app-employer-form',
  templateUrl: './employer-form.component.html',
  styleUrls: ['./employer-form.component.css']
})
export class EmployerFormComponent implements OnInit {

  employerForm: FormGroup;
  employer: Employer;
  operator: string;
  operatorId;
  saveChanges = false;
  projects = [];
  operators = [];
  status: object;

  headers = [
    {label: 'הערות',    link: 'comments'   },
    {label: 'מחלקות',   link: 'departments'},
    {label: 'מסמכים',   link: 'documents'  },
    {label: 'אנשי קשר', link: 'contacts'   },
    {label: 'סליקה',    link: 'defrayal'   },
    {label: 'פיננסי',   link: 'finance'    },
    {label: 'משימות',   link: 'tasks'      },
    {label: 'דוחות',    link: 'reports'    },
  ];

  statuses = [
    {name: 'לא פעיל', id: 'inactive'},
    {name: 'פעיל',    id: 'active'},
    {name: 'בהקמה',   id: 'onProcess'},
  ];

  constructor(private router: Router,  private fb: FormBuilder,  private route: ActivatedRoute,
              private selectUnit: SelectUnitService, private employersResolve: EmployersResolve,
              private employerService: EmployerService) { }

  ngOnInit() {
    this.selectUnit.currentEmployerID = this.route.snapshot.params.id;
    this.employersResolve.resolve(this.route.snapshot).then( response => {
      this.employer = response;
      this.getStatus();
      if (response.operator !== null) {
        this.operatorId = response.operator.id;
      }
    });
    this.employerService.getProjects().then(response => this.projects = response);
    this.employerService.getOperator(this.selectUnit.currentEmployerID).then(response => {
      this.operators = response;
      this.getOperator();
    });
    this.initForm();
  }

  initForm(): void {
    this.employerForm = this.fb.group({
      'employerName': [null , Validators.required],
      'businessNumber': [null , Validators.required],
      'deductionNumber': [],
      'email': [null , [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'), Validators.required]],
      'phone': [null,  Validators.required],
      'address': [],
      'project': [null,  Validators.required],
      'operator': [null,  Validators.required],
      'status': [null,  Validators.required],
    })
    ;
  }

  getOperator() {
    for (let i = 0; i < this.operators.length; i++) {
      if (this.operators[i].id === this.operatorId) {
        this.operator = this.operators[i];
      }
    }
  }

  getStatus() {
    for (let i = 0; i < this.statuses.length; i++) {
      if (this.statuses[i].id === this.employer.status) {
        this.status = this.statuses[i];
      }
    }
  }

  submit(valid) {
    console.log(valid);
  }

}
