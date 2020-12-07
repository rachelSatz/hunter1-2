import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { fade } from '../../../../shared/_animations/animation';
import { DataTableComponent } from '../../../../shared/data-table/data-table.component';
import { DatePipe } from '@angular/common';
import {ERROR_STATUS} from '../../../../shared/_models/invoice.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-credit-card-exel',
  templateUrl: './credit-card-exel.component.html',
  styleUrls: ['./credit-card-exel.component.css'],
  styles: ['#styleFormat { height: 200px; padding-top: 20px }', '::ng-deep .mat-dialog-container {overflow: visible;}'],
  animations: [ fade ]
})
export class CreditCardExelComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  fileName = '';
  spin: boolean;
  error_status = Object.keys(ERROR_STATUS).map(function(e) {
    return { id: e, name: ERROR_STATUS[e] };
  });
  creditCardForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<CreditCardExelComponent>,
              public datePipe: DatePipe,
              private fb: FormBuilder ) {}

  ngOnInit() {
    this.initCreditCardForm();
  }

  initCreditCardForm(): void {
    this.creditCardForm = this.fb.group({
      'tax': [null, [Validators.required]],
    });
  }
  onSubmit(tax: boolean): void {
    console.log(tax);
    this.dialogRef.close(tax);

  }

}

