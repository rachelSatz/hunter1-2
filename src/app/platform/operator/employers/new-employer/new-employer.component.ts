import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-employer',
  templateUrl: './new-employer.component.html',
  styleUrls: ['./new-employer.component.css'],
  providers: [FormBuilder]
})
export class NewEmployerComponent implements OnInit {

  newEmployerForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.newEmployerForm = this.fb.group(
      {
        'employerDetails': this.fb.group({
          'name':            [null, Validators.required],
          'businessNumber':  [null, [Validators.pattern('^\\d{9}$'), Validators.required]],
          'deductionNumber': [],
          'email':           [null, [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'), Validators.required]],
          'address':         [],
          'phone':           [],
          'project':         [null, Validators.required],
          'operator':        [null, Validators.required],
          'status':          [null, Validators.required]
        }),
      'contactDetails': this.fb.group({
        'firstName':       [null, Validators.required],
        'lastName':        [null, Validators.required],
        'gender':          [],
        'phone':           [null, Validators.required],
        'mobile':          [null, Validators.required],
        'fax':             [],
        'email':           [null, [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'), Validators.required]],
        'address':         [],
      }), 'comments':        [],
      'defrayal': this.fb.group({
        'businessNumber':    [null, [Validators.pattern('^\\d{9}$'), Validators.required]],
        'sendingNumber':     [null, [Validators.pattern('^\\d{9}$'), Validators.required]],
        'institutionCode5':  [null, [Validators.pattern('^\\d{5}$'), Validators.required]],
        'institutionCode8':  [null, [Validators.pattern('^\\d{8}$'), Validators.required]],

      })
      }
    );
  }

  submit(form: NgForm) {
    console.log(form.value);
  }
}
