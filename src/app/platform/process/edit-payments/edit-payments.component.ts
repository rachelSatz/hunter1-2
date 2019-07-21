import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import {
  DepositStatus,
  DepositType,
  EmployeeStatus,
  MonthlyTransferBlock,
  Types } from 'app/shared/_models/monthly-transfer-block';
import { Company } from 'app/shared/_models/company.model';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';

@Component({
  selector: 'app-edit-payments',
  templateUrl: './edit-payments.component.html',
  styleUrls: ['./edit-payments.component.css']

})
export class EditPaymentsComponent implements OnInit {

  arryMtb: MonthlyTransferBlock[] = [];
  // idsTransfer = [];
  mtb: MonthlyTransferBlock;
  employeeStatus = EmployeeStatus;
  depositType = DepositType;
  depositStatus = DepositStatus;
  products = [];
  companies: Company[] = [];
  editPaymentForm: FormGroup;
  error_sum = false;
  sum= 0;

  lstTypes = Object.keys(Types).map(function(e) {
    return { id: e, name: Types[e] };
  });

  lstDepositType = Object.keys(DepositType).map(function(e) {
    return { id: e, name: DepositType[e] };
  });

  lstDepositStatus = Object.keys(DepositStatus).map(function(e) {
    return { id: e, name: DepositStatus[e] };
  });

  lstEmployeeStatus = Object.keys(EmployeeStatus).map(function(e) {
    return { id: e, name: EmployeeStatus[e] };
  });

  constructor(public route: ActivatedRoute,
              private selectUnit: SelectUnitService,
              private fb: FormBuilder,
              private mtbService: MonthlyTransferBlockService,
              private ref: ChangeDetectorRef,
              private notificationService: NotificationService,
              private _location: Location) { }

  ngOnInit() {
    if (this.route.snapshot.data.mtb) {
      this.mtb = this.route.snapshot.data.mtb;
      this.arryMtb.push(this.route.snapshot.data.mtb);
    }

    this.companies = this.selectUnit.getCompanies();
    this.initForm();

  }


  initForm(): void {
    this.editPaymentForm = this.fb.group({
      'mtb': this.fb.array([
        this.fb.group({
          'salary': [null , Validators.required],
          'working_days_in_month': [null ],
          'work_month_percentage': [null , Validators.required],
          'employee_status': [null],
          'employee_status_start_date': [],
          'salary_month': [null,  Validators.required],
          'company_id': [null,  Validators.required],
          'product_id': [null,  Validators.required],
          'deposit_type':    [null, Validators.required],
          'deposit_status': [null,  Validators.required],
          'transfer_clause': this.fb.array([])
        })
      ]),
    });

    let m = this.editPaymentForm.get('mtb');
    m.patchValue( this.arryMtb);
    m = (<FormArray>m).controls[0];
    this.arryMtb[0].transfer_clause.forEach(transfer => {
      this.sum  += transfer.transfer_sum;
      this.addTransfer(m, transfer);

    });
  }

  addMtb(mtb?: Object): void {
    const mtbControl = {
      'id': [mtb  ? +mtb['id'] : null],
      'salary': [mtb  ? +mtb['salary'] : null,  Validators.required],
      'working_days_in_month': [mtb  ? +mtb['working_days_in_month'] : null],
      'work_month_percentage': [mtb ? +mtb['work_month_percentage'] : null ,  Validators.required],
      'employee_status': [mtb ? mtb['employee_status'] : null,  Validators.required],
      'employee_status_start_date':  [mtb ? mtb['employee_status_start_date'] : null],
      'salary_month':  [mtb ? mtb['salary_month'] : null,  Validators.required],
      'company_id': [mtb ? +mtb['employer_company_id'] : null,  Validators.required],
      'product_id': [mtb ? +mtb['product_id'] : null,  Validators.required],
      'deposit_type': [mtb ? mtb['deposit_type'] : null,  Validators.required],
      'deposit_status': [mtb ? mtb['deposit_status'] : null,  Validators.required],
      'transfer_clause':  this.fb.array([
        this.fb.group({
          'id': [null ],
          'clause_type':  [null , Validators.required],
          'transfer_sum':  [null , Validators.required],
          'transfer_percent':  [null,  Validators.required],
          'exempt_sum': [0 , Validators.required],
        })
      ])
    };

    const mtbGroup = (<FormArray>this.editPaymentForm.get('mtb'));
    mtbGroup.push(this.fb.group(mtbControl));
    this.arryMtb.push(this.mtb);
  }

  removeMtb(index: number): void {
    const mtbGroup = (<FormArray>this.editPaymentForm.get('mtb'));
    mtbGroup.removeAt(index);
  }

  getMtbArrControls(): any[] {
    return (<FormArray>this.editPaymentForm.get('mtb')).controls;
  }

  getArrControls(m: any): any[] {
    return (<FormArray>m.get('transfer_clause')).controls;
  }

  addTransfer(m: any, transfer?: Object): any {

    const transferControl = {
      'id': [transfer  ? +transfer['id'] : null],
      'clause_type': [transfer  ? transfer['clause_type'] : '',  Validators.required],
      'transfer_sum': [transfer  ? +transfer['transfer_sum'] : 0,  Validators.required],
      'transfer_percent': [transfer ? +transfer['transfer_percent'] : 0 ,  Validators.required],
      'exempt_sum': [transfer ? +transfer['exempt_sum'] : 0,  Validators.required]
    };
    const transferGroup =  (<FormArray>m.get('transfer_clause'));
    transferGroup.push(this.fb.group(transferControl));

  }

  remove(m: any, index: number): void {
    const transfer = (<FormArray>m.get('transfer_clause'));
    transfer.removeAt(index);
  }

  selectedProducts(item): void {
    this.products = this.companies.find(c => c.id === item).product;
  }

  submit(form: NgForm): void {
    if (this.sum !== this.mtb.amount) {
       this.notificationService.warning('' , ' סה"כ לא שווה לסהכ פיצול ');
    } else {
      if (form.valid) {
        this.mtbService.setEditPayments(this.mtb.id, form.value).then(r => {
          if (r['result'] === 'no') {
            this.notificationService.error('הפיצול נכשל', '');
          } else {
            this.previous();
          }
        });
      }
    }
  }


  sumPercent(m: any, transfer: FormGroup, index, i): void {
    const salary = m.value.salary;
    this.sum = parseFloat((this.sum -
      this.arryMtb[index].transfer_clause[i].transfer_sum + transfer.value.transfer_sum).toFixed(2));
    this.arryMtb[index].transfer_clause[i].transfer_sum = transfer.value.transfer_sum;
    if (this.sum !== this.mtb.amount) {
      this.error_sum = true;
    } else {
      this.error_sum = false;

    }
    transfer.patchValue({'transfer_percent':  (transfer.value.transfer_sum / salary * 100).toFixed(2)});
  }

  previous() {
    this._location.back();
  }


}
