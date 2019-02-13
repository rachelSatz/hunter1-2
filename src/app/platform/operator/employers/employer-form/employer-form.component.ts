import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SelectUnitService } from 'app/shared/_services/select-unit.service';
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
  employerName: string;
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

  readonly statuses = [
    {label: 'active', name: 'פעיל'},
    {label: 'inactive', name: 'לא פעיל'},
    {label: 'on_process', name: 'בהקמה'},
  ];

  constructor(private router: Router,  private fb: FormBuilder,  private route: ActivatedRoute,
              private selectUnit: SelectUnitService, private employersResolve: EmployersResolve) { }

  ngOnInit() {
    // this.router.navigate(['./', 'operator', 'employers', 'form', this.router.url.split('/')[5], 'comments'])
    this.selectUnit.currentEmployerID = this.route.snapshot.params.id;
    this.employersResolve.resolve(this.route.snapshot).then( response => {
      this.employer = response;
      if (response.operator !== null) {
        this.employerName = response.operator['first_name'] + ' ' + response.operator['last_name'];
      }
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

  submit(valid) {
    console.log(valid);
  }

}
