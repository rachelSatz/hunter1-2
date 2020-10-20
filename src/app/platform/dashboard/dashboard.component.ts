import { Component, OnInit } from '@angular/core';
import {GeneralService} from '../../shared/_services/http/general.service';
import { DatePipe } from '@angular/common'
import {split} from 'ts-node/dist';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  fromDateFormControl = new FormControl('', [
    Validators.required
  ]);
  toDateFormControl = new FormControl('', [
    Validators.required
  ]);
  projects = [];
  projectId: number;
  timeRange = [{id: 1, name: 'לפי חודש'}, {id: 2, name: 'לפי תקופה'}];
  timeRangeId: number;
  month: Date;
  fromDate: Date;
  toDate: Date;
  ifByMonth: boolean = true;
  monthStr: string;
  fromDateStr: string;
  toDateStr: string;
  arrSumInvoicesSystem: []
  arrSumIncomes: []
  sum_incomes: any
  sum_invoices_system: any;
  data: any;
  constructor(private GeneralService: GeneralService,
              public datepipe: DatePipe) {
  }

  ngOnInit() {
    this.fetchItems();
    // this.data['invoice_system']['green_invoices']['count']=5

  }

  fetchItems(): void {
    this.GeneralService.getProjects(1)
      .then(response => {  this.projects = response[('1')];
                                      this.month = new Date();
                                      this.projectId = 1;
                                      this.timeRangeId = 1;
                                      this.filterData(); });
  }

  changeTimeRange(): void{
    // this.fromDate = null;
    // this.toDate = null;
    this.fromDateFormControl = new FormControl('', [
      Validators.required
    ]);
    this.toDateFormControl = new FormControl('', [
      Validators.required
    ]);
    this.month = new Date()
  }
  filterData(): void {
    // this.toDateFormControl.markAsTouched();
    // this.fromDateFormControl.markAsTouched();
    debugger;
    if((this.timeRangeId==2 && this.fromDate && this.toDate)||(this.timeRangeId==1 && this.month)){
      this.monthStr = this.datepipe.transform(this.month, 'yyyy-MM-dd');
      this.fromDateStr = this.datepipe.transform(this.fromDate, 'yyyy-MM-dd');
      this.toDateStr = this.datepipe.transform(this.toDate, 'yyyy-MM-dd');
      if (this.timeRangeId === 2)
        this.ifByMonth = false;
      this.GeneralService.get_financial_data(this.projectId, this.ifByMonth, this.monthStr, this.fromDateStr, this.toDateStr)
        .then(response =>{ this.data = response['data'];
          console.log(this.data);
          this.sum_invoices_system = this.data['invoice_system']['green_invoices']['sum']+this.data['invoice_system']['green_invoices_error']['sum'];
          this.sum_incomes =this.data['incomes']['incomes_from_new_employers']['sum']+this.data['incomes']['incomes_est_payment_amount']['sum'];

        } )
    }

  }
}
