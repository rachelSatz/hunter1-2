import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { Employer, EmployerStatus, IdentifierTypes } from 'app/shared/_models/employer.model';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { EmployersResolve } from 'app/shared/_resolves/employers.resolve';
import { NotificationService } from 'app/shared/_services/notification.service';
import { PaymentType } from 'app/shared/_models/process.model';



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
  activeUrl: string;


  headers = [
    {label: 'הערות',    url: 'comments'   },
    {label: 'מחלקות',   url: 'departments'},
    {label: 'מסמכים',   url: 'documents'  },
    {label: 'אנשי קשר', url: 'contacts'   },
    {
      label: 'סליקה',    url: 'defrayal' , subMenuLinks: [
        { url: 'bank', label: 'בנק לקופה' },
        { url: 'number', label: 'מספר אצל ליצרן' }
      ]
    },
    {label: 'פיננסי',   url: 'finance'    },
    {label: 'משימות',   url: 'tasks'      },
    {label: 'דוחות',    url: 'reports'    },
  ];

  statuses = Object.keys(EmployerStatus).map(function(e) {
    return { id: e, name: EmployerStatus[e] };
  });

  paymentType = Object.keys(PaymentType).map(function(e) {
    return { id: e, name: PaymentType[e] };
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
        this.activeUrl = 'comments';
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

    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.setActiveUrl(event.url);
      }
    });
  }

  private setActiveUrl(url: string): void {
    const urlSplit = url.split('/');
    this.activeUrl = urlSplit[urlSplit.length - 1];

  }

  initForm(): void {
    this.employerForm = this.fb.group({
      'name': [null , Validators.required],
      'businessNumber': [null , Validators.required],
      'deductionNumber': [],
      // 'email': [null , [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'), Validators.required]],
      'phone': [null,  Validators.required],
      'address': [],
      'project': [this.project,  Validators.required],
      'operator': [this.operator,  Validators.required],
      'status': [null,  Validators.required],
      'identifierType':    [null, Validators.required],
      'sendingNumber':     [null, [Validators.pattern('^\\d{9}$'), Validators.required]],
      'paymentType': [null, Validators.required],
      'institutionCode5':  [null, [Validators.pattern('^\\d{5}$')]],
      'institutionCode8':  [null, [Validators.pattern('^\\d{8}$')]]
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

  back(): void {
    if (this.router.url.includes( 'operator')) {
      this.router.navigate(['/platform', 'operator' , 'employers']);
    }else {
      this.router.navigate(['/platform', 'employers']);
    }
  }
  ngOnDestroy() {
    this.selectUnit.currentEmployerID = 0;
  }
}
