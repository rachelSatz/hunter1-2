import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Select2OptionData } from 'ng2-select2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { EmployeeService } from '../../../shared/_services/http/employee.service';
import { GeneralHttpService } from '../../../shared/_services/http/general-http.service';
import { ManualProcessService } from '../../../shared/_services/http/manual-process.service';

import { Employee } from '../../../shared/_models/employee.model';
import { EmployeePayment } from '../../../shared/_models/employee-payment.model';
import { Manufacturer } from '../../../shared/_models/manufacturer.model';
import { Product } from '../../../shared/_models/product.model';
import { Process } from '../../../shared/_models/process.model';

@Component({
  selector: 'app-employee-payment-form',
  templateUrl: './employee-payment-form.component.html',
  styleUrls: ['./employee-payment-form.component.css'],
  animations: [
    trigger('slideToggle', [
      state('inactive', style({
        height: 0,
        opacity: '0',
        display: 'none'
      })),
      state('active', style({
        height: '*',
        opacity: '1',
        display: '*'
      })),
      transition('inactive => active', animate('400ms ease-in')),
      transition('active => inactive', animate('400ms ease-out'))
    ])
  ]
})
export class EmployeePaymentFormComponent implements OnInit {

  @ViewChild('f') newEmployeeForm1: NgForm;
  @ViewChild('f2') newPaymentForm1: NgForm;
  
  newEmployeeForm: FormGroup;
  newPaymentForm: FormGroup;
  isClicked = false;

  StatusUpdatedAtDate: Date = new Date();
  TaarichErechDate: Date;
  
  employeeSelectedValue: string;
  manufSelectedValue: string;
  productSelectedValue: string;

  sugTakbulOption: { Key: string, Value: number }[] = [];
  statusDepositOption: { Key: string, Value: number }[] = [];
  worksInSalaryOption: { Key: string, Value: number }[] = [];
  select2Options: Select2Options;
  employeesSelect2: Select2OptionData[] = [];
  manufacturersSelect2: Select2OptionData[] = [];
  productsSelect2: Select2OptionData[] = [];


  process: Process;
  employees: Employee[] = [];
  manufacturers: Manufacturer[] = [];
  products: Product[] = [];

  payment: EmployeePayment = new EmployeePayment(); 

  searchCriteria = {};


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EmployeePaymentFormComponent>,
              private employeeService: EmployeeService, private generalService: GeneralHttpService,
              private manualProcessService: ManualProcessService) {
    this.process = data.process;
    this.TaarichErechDate = new Date(this.process.year, this.process.month - 1, 1);
  }

  ngOnInit() {
    this.payment = new EmployeePayment();
    this.searchCriteria['employerId'] = this.process.employer.id;
    this.employeeService.getEmployees(this.searchCriteria).then(response => this.setEmployeesData(response));

    this.generalService.getManufacturers().then(response => this.setManufacturersData(response));
    this.generalService.getProducts().then(response => this.setProductsData(response));
    this.generalService.getSugTakbulEnum().then(response => {
      this.sugTakbulOption = response;
    });

    this.generalService.getStatusDepositEnum().then(response => this.statusDepositOption = response);
    this.generalService.getWorksInSalaryEnum().then(response => this.worksInSalaryOption = response);


    this.initEmpPaymentForm();
    this.initPaymentForm();
  }

  setEmployeesData(response: Employee[]): void {
    this.employees = response;
    this.employeesSelect2 = this.setEmployeeSelect2Data(response);
  }

  setManufacturersData(response: Manufacturer[]): void {
    this.manufacturers = response;
    this.manufacturersSelect2 = this.setSelect2Data(response, 'בחר יצרן');
  }

  setProductsData(response: Product[]): void {
    this.products = response;
    this.productsSelect2 = this.setSelect2Data(response, 'בחר קופה');
  }

  onManufValueChanged(value: string): void {
    this.manufSelectedValue = value;
    if (value !== '0') {
      this.generalService.getProductsByManuf(+value).then(response => this.setProductsData(response));
    }
  }

  onEmployeeValueChanged(value: string): void {
    this.employeeSelectedValue = value;

  }

  onProductValueChanged(value: string): void {
    this.productSelectedValue = value;

  }

  private setEmployeeSelect2Data(values: Object[]): Select2OptionData[] {
    const data = [
      {id: '0', text: 'בחר עובד'}
    ];
    for (let i = 0; i < values.length; i++) {
      data[i + 1] = {id: values[i]['id'], text: values[i]['firstName'] + ' ' + values[i]['lastName']};
    }
    return data;
  }

  private setSelect2Data(values: Object[], textLabel: string): Select2OptionData[] {
    const data = [
      {id: '0', text: textLabel}
    ];
    
    for (let i = 0; i < values.length; i++) {
      data[i + 1] = {id: values[i]['id'], text: values[i]['name']};
    }
    
    return data;
  }


  onSubmitForm(): void {
  
    if ((this.isClicked === true && this.newEmployeeForm1 != null && !this.newEmployeeForm1.valid) || !this.newPaymentForm1.valid) {
      return;
    }
    
    if (this.isClicked === true) {
      this.payment.employee.id = -1;
    }

    this.payment.DateStatusWorks = this.StatusUpdatedAtDate.toLocaleString('he-IL',{formatMatcher: 'basic'});
    this.payment.TaarichErech = this.TaarichErechDate.toLocaleString('he-IL',{formatMatcher: 'basic'});
    this.payment.uplodefile = this.process;

    this.payment.product = this.products.find((product) => {
      return product.id.toString() === this.productSelectedValue;
    });

    this.payment.product.manufacturer = this.manufacturers.find((manufacturer) => {
      return manufacturer.id.toString() === this.manufSelectedValue;
    });

    if (this.isClicked === false) {
      this.payment.employee = this.employees.find((employee) => {
        return employee.id.toString() === this.employeeSelectedValue;
      });
    }
    
    this.manualProcessService.AddPreHafrashot(this.payment).then(response => {
      this.dialogRef.close(response);
    });
  }

  createNewEmployeeOnClick(): void {
    this.isClicked = !this.isClicked;
  }

  private initEmpPaymentForm(): void {
    this.newEmployeeForm = new FormGroup({
      'empFirstName': new FormControl('', [Validators.required]),
      'empLastName': new FormControl('', [Validators.required]),
      'empIdentityNum': new FormControl('', Validators.required),
      'empEmail': new FormControl('', [Validators.required, Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')]),
      'empPhone': new FormControl('', [Validators.required]),
    });
  }

  private initPaymentForm(): void {
    this.newPaymentForm = new FormGroup({
      'taarichErech': new FormControl('',[Validators.required]),
      'statusUpdatedAt': new FormControl('',[Validators.required]),
      'sugTakbul': new FormControl(1,[Validators.required]),
      'statusdeposit': new FormControl(1,[Validators.required]),
      'worksInSalary': new FormControl(1,[Validators.required]),
      'empty': new FormControl('')
    });

    this.payment.sugTakbul = 1;
    this.payment.statusDeposit = 1;
    this.payment.WorksInSalary = 1;
  }

  onCloseClicked(): void {
    this.dialogRef.close('cancel');
  }
}
