import { Component, OnInit } from '@angular/core';
import {GeneralService} from '../../shared/_services/http/general.service';
import { DatePipe } from '@angular/common'
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher, MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {EstPaymentFormComponent} from './est-payment-form/est-payment-form.component';
import {NewEmployersFormComponent} from './new-employers-form/new-employers-form.component';
import {EmployersFormComponent} from './employers-form/employers-form.component';
import {Subscription} from 'rxjs';
import { OtherPayerPopupComponent } from './other-payer-popup/other-payer-popup.component';
import {ChargedEmployersFormComponent} from "./charged-employers-form/charged-employers-form.component";
import {ManuallyChargedEmployersComponent} from "./manually-charged-employers/manually-charged-employers.component";
import {EmployersWithNoPaymentComponent} from "./employers-with-no-payment/employers-with-no-payment.component";
import {EmployersPaymentZeroComponent} from "./employers-payment-zero/employers-payment-zero.component";

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
  days = {0: 'א',1: 'ב', 2:'ג', 3: 'ד',4:'ה', 5:'ו',6:'ז' }
  timeRangeId: number;
  month: Date;
  currentMonth: Date;
  fromDate: Date;
  currentFromDate: Date;
  toDate: Date;
  currentToDate: Date;
  ifByMonth: boolean = true;
  monthStr: string;
  fromDateStr: string;
  toDateStr: string;
  sum_incomes: any
  sum_invoices_system: any;
  data: any;
  d: any;
  newDate: Date;
  sub = new Subscription;
  constructor(private GeneralService: GeneralService,
              private dialog: MatDialog,
              public datepipe: DatePipe,
              private router: Router,
              private route: ActivatedRoute) {
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
    this.fromDate = null;
    this.toDate = null;
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
    this.currentFromDate = this.fromDate;
    this.currentToDate = this.toDate;
    this.currentMonth = this.month;
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
          this.sum_invoices_system = this.data['invoice_system']['green_invoices']['sum'] + this.data['invoice_system']['green_invoices_error']['sum'];
          this.sum_incomes = this.data['incomes']['incomes_from_new_employers']['sum'] + this.data['incomes']['incomes_est_payment_amount']['sum'];
        } )
    }
  }
  openInvoices(status: string): void {
    if(this.currentFromDate && this.currentToDate){
      this.fromDateStr = this.datepipe.transform(this.currentFromDate, 'yyyy-MM-dd');
      this.toDateStr = this.datepipe.transform(this.currentToDate, 'yyyy-MM-dd');
      this.router.navigate(['../../platform/finance/invoices', {status: status, from_date: this.fromDateStr, to_date: this.toDateStr, project_id: this.projectId}])
    } else {
      this.toDate= new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth()+1,0);
      this.fromDateStr = this.datepipe.transform(new Date(this.currentMonth.getFullYear(),this.currentMonth.getMonth(),1), 'yyyy-MM-dd');
      this.toDateStr = this.datepipe.transform(this.toDate, 'yyyy-MM-dd');
      this.router.navigate(['../../platform/finance/invoices', {status: status, from_date:this.fromDateStr , to_date: this.toDateStr, project_id: this.projectId}])
    }
  }
  openCalcProcesses(): void{
    if(this.currentFromDate && this.currentToDate){
      this.fromDateStr = this.datepipe.transform(this.currentFromDate, 'yyyy-MM-dd');
      this.toDateStr = this.datepipe.transform(this.currentToDate, 'yyyy-MM-dd');
      this.router.navigate(['../../platform/finance/calc-processes', { from_date: this.fromDateStr, to_date: this.toDateStr, project_id: this.projectId}])
    } else {
      this.toDate= new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth()+1,0);
      this.fromDateStr = this.datepipe.transform(new Date(this.currentMonth.getFullYear(),this.currentMonth.getMonth(),1), 'yyyy-MM-dd');
      this.toDateStr = this.datepipe.transform(this.toDate, 'yyyy-MM-dd');
      this.router.navigate(['../../platform/finance/calc-processes', { from_date:this.fromDateStr , to_date: this.toDateStr, project_id: this.projectId}])
    }
  }
  openEstPaymentForm(): void{
    const dialog = this.dialog.open(EstPaymentFormComponent, {
      data: {
        'from_date': this.currentFromDate,
        'to_date': this.currentToDate,
        'month': this.month,
        'project_id': this.projectId
      },
      width: '1000px',
      minHeight: '500px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
      this.router.navigate(['../../platform/dashboard'])
    }));
  }
  openNewEmployersForm(): void{
    const dialog = this.dialog.open(NewEmployersFormComponent, {
      data: {
        'from_date': this.currentFromDate,
        'to_date': this.currentToDate,
        'month': this.month,
        'project_id': this.projectId
      },
      width: '1000px',
      minHeight: '500px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
      this.router.navigate(['../../platform/dashboard'])
    }));
  }

  getDayHe(date: string){
    this.newDate = new Date(date);
    return this.days[this.newDate.getDay()];
    // 'א'+ this.newDate.getDay();
  }
  openEmployersForm(payment_method: string): void{
    const dialog = this.dialog.open(EmployersFormComponent, {
      data: {
        'payment_method': payment_method,
        'project_id': this.projectId
      },
      width: '1000px',
      minHeight: '500px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
    if(result){
      this.router.navigate(['../../platform/employers/form/'+ result])
    }
    else {
      this.router.navigate(['../../platform/dashboard'])
    }
    }));
  }
  openChargedEmployerPopUp(): void{
    const dialog = this.dialog.open(ChargedEmployersFormComponent, {
      data: {
        'from_date': this.currentFromDate,
        'to_date': this.currentToDate,
        'month': this.month,
        'project_id': this.projectId
      },
      width: '1000px',
      minHeight: '500px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
        this.router.navigate(['../../platform/dashboard'])
    }));
  }
  openManuallyChargedPopUp(): void{
    const dialog = this.dialog.open(ManuallyChargedEmployersComponent, {
      data: {
        'from_date': this.currentFromDate,
        'to_date': this.currentToDate,
        'month': this.month,
        'project_id': this.projectId
      },
      width: '1000px',
      minHeight: '500px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
      this.router.navigate(['../../platform/dashboard'])
    }));
  }
  openEmployersWithNoPaymentPopUp(): void{
    const dialog = this.dialog.open(EmployersWithNoPaymentComponent, {
      data: {
        'from_date': this.currentFromDate,
        'to_date': this.currentToDate,
        'month': this.month,
        'project_id': this.projectId
      },
      width: '1000px',
      minHeight: '500px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
      this.router.navigate(['../../platform/dashboard'])
    }));
  }
  openEmployersPaymentZeroPopUp(): void{
    const dialog = this.dialog.open(EmployersPaymentZeroComponent, {
      data: {
        'from_date': this.currentFromDate,
        'to_date': this.currentToDate,
        'month': this.month,
        'project_id': this.projectId
      },
      width: '1000px',
      minHeight: '500px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
      this.router.navigate(['../../platform/dashboard'])
    }));
  }
  showInvoices(): void{
    this.router.navigate(['../../platform/finance/invoices'])
  }
}
