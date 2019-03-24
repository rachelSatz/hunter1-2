import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { Employer, EmployerStatus, IdentifierTypes } from 'app/shared/_models/employer.model';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { EmployersResolve } from 'app/shared/_resolves/employers.resolve';
import { NotificationService } from 'app/shared/_services/notification.service';



@Component({
  selector: 'app-employer-form',
  templateUrl: './employer-form.component.html',
  styleUrls: ['./employer-form.component.css']
})
export class EmployerFormComponent implements OnInit, OnDestroy {

  employerForm: FormGroup;
  employer: Employer;
  operators = [];
  operator: string;
  operatorId;
  projects = [];
  project = {id: 0, name: ''};
  status: object;
  saveChanges = false;


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

  statuses = Object.keys(EmployerStatus).map(function(e) {
    return { id: e, name: EmployerStatus[e] };
  });

  identifierTypes = Object.keys(IdentifierTypes).map(function(e) {
    return { id: e, name: IdentifierTypes[e] };
  });

  constructor(private router: Router,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private selectUnit: SelectUnitService,
              private employersResolve: EmployersResolve,
              private notificationService: NotificationService,
              private employerService: EmployerService) { }

  ngOnInit() {
    this.selectUnit.currentEmployerID = this.route.snapshot.params.id;
    if (this.route.snapshot.data.employer) {
        this.employer = this.route.snapshot.data.employer;
        this.setStatus();

        if ( this.employer.operator !== null) {
          this.operatorId =  this.employer.operator.id;
        }

        this.project.id =  this.employer.project_id;
        this.project.name = this.employer.project_name;
    }
    this.employerService.getProjects().then(response => {
      this.projects = response;
    });
    this.employerService.getOperator( this.selectUnit.currentEmployerID, 'employerId').then(response => {
      this.operators = response;
      this.setOperator();
    });
    this.initForm();
  }

  initForm(): void {
    this.employerForm = this.fb.group({
      'name': [null , Validators.required],
      'businessNumber': [null , Validators.required],
      'deductionNumber': [],
      'email': [null , [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'), Validators.required]],
      'phone': [null,  Validators.required],
      'address': [],
      'project': [this.project,  Validators.required],
      'operator': [this.operator,  Validators.required],
      'status': [null,  Validators.required],
      'identifierType':    [null, Validators.required],
      'sendingNumber':     [null, [Validators.pattern('^\\d{9}$'), Validators.required]],
      'institutionCode5':  [null, [Validators.pattern('^\\d{5}$'), Validators.required]],
      'institutionCode8':  [null, [Validators.pattern('^\\d{8}$'), Validators.required]]
    });
  }

  setOperator() {
    for (let i = 0; i < this.operators.length; i++) {
      if (this.operators[i].id === this.operatorId) {
        this.operator = this.operators[i];
      }
    }
  }

  setStatus() {
    for (let i = 0; i < this.statuses.length; i++) {
      if (this.statuses[i].id === this.employer.status) {
        this.status = this.statuses[i];
      }
    }
  }

  submit(form: NgForm) {
    if (form.valid) {
      this.employerService.updateEmployer( form.value, this.employer.id).then(
        response => {
          if (response) {
            this.notificationService.success('נשמר בהצלחה.');
          } else {
            this.notificationService.warning('נכשל.');
          }
        }
      );
    }
  }

  ngOnDestroy() {
    this.selectUnit.currentEmployerID = 0;
  }
}
