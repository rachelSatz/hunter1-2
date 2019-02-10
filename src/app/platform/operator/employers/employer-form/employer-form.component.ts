import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-employer-form',
  templateUrl: './employer-form.component.html',
  styleUrls: ['./employer-form.component.css']
})
export class EmployerFormComponent implements OnInit {

  employerForm: FormGroup;

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

  constructor(private router: Router,  private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.employerForm = this.fb.group({
      'email': [ null, Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')],
      'phone': [null , Validators.pattern('[0-9]+')],
      'address': ['island'],
      'project': [],
      'operator': [],
      'status': []
    })
    ;
  }

  test(name, value) {
    this.employerForm.controls[name].patchValue(value);
    console.log('this.employerForm.controls[name].value');
  }
}
