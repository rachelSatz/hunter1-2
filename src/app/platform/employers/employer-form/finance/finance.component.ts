import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { fade } from '../../../../shared/_animations/animation';
import { el } from '@angular/platform-browser/testing/src/browser_util';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerService } from '../../../../shared/_services/http/employer.service';
import { NotificationService } from '../../../../shared/_services/notification.service';
import {
  CURRENCY,
  EmployerFinancialDetails, EmployerFinancialPayments, EmployerFinancialProduct, LANGUAGE,
  NO_PAYMENT_TIME,
  PAYMENT_METHOD,
  PAYMENT_TERMS,
  PAYMENT_TIME, PAYMENT_TYPE, PRODUCT_TYPES, TAX
} from '../../../../shared/_models/employer-financial-details.model';
import { Employer } from '../../../../shared/_models/employer.model';
import { SelectUnitService } from '../../../../shared/_services/select-unit.service';
import { Subscription } from 'rxjs';
import { emptyScheduled } from 'rxjs/internal/observable/empty';



@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css'],
  animations: [fade]
})

export class FinanceComponent implements OnInit{
  @ViewChild(FinanceComponent) doughnut: FinanceComponent;

  paymentTermsItems = Object.keys(PAYMENT_TERMS).map(function (e) {
    return {id: e, name: PAYMENT_TERMS[e]};
  });
  paymentMethodItems = Object.keys(PAYMENT_METHOD).map(function(e) {
    return { id: e, name: PAYMENT_METHOD[e] };
  });

  paymentTimeItems = Object.keys(PAYMENT_TIME).map(function(e) {
    return { id: e, name: PAYMENT_TIME[e] };
  });
  noPaymentTimeItems = Object.keys(NO_PAYMENT_TIME).map(function(e) {
    return { id: e, name: NO_PAYMENT_TIME[e] };
  });
  taxItems = Object.keys(TAX).map(function(e) {
    return { id: e, name: TAX[e] };
  });
  currencyItems = Object.keys(CURRENCY).map(function(e) {
    return { id: e, name: CURRENCY[e] };
  });
  languageItems = Object.keys(LANGUAGE).map(function(e) {
    return { id: e, name: LANGUAGE[e] };
  });
  productTypesItems = Object.keys(PRODUCT_TYPES).map(function(e) {
    return { id: e, name: PRODUCT_TYPES[e] };
  });
  paymentTypesItems = Object.keys(PAYMENT_TYPE).map(function(e) {
    return { id: e, name: PAYMENT_TYPE[e] };
  });
  organizationId;
  employerId ;
  rowIndex: number;
  isNoPaymentTime : boolean;
  openDatePicker :boolean;
  displayMasav: boolean;
  check: any;
  arrShow:Array<boolean> = new Array<boolean>()
  isEstablishingPayment: boolean;
  estPaymentAmount = 0;
  financialDetails: EmployerFinancialDetails = new EmployerFinancialDetails();
  payEmployers: Employer[];
  hasServerError: boolean;
  sub = new Subscription;
  employerId2: number;


  constructor(private route: ActivatedRoute,
              public router:Router,
              private EmployerService:EmployerService,
              private notificationService:NotificationService,
              private selectUnit:SelectUnitService) {
  }

  ngOnInit() {
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
        this.fetchItems();
      }
    ));
    this.EmployerService.getEmployers()
      .then(res=> { this.payEmployers = res['1'];
        this.fetchItems();});


    }

    fetchItems() {
       if(this.selectUnit.currentEmployerID > 0){
      this.organizationId = this.selectUnit.getOrganization();
      this.employerId = this.selectUnit.getEmployerID();
      this.EmployerService.getEmployerFinance(this.employerId)
          .then(res=>{
            if(res.id){
              this.financialDetails = res;
              this.EmployerService.getEmployerByEmployerRelationId(this.financialDetails.pay_employer_relation.id)
                .then(res2=>{ this.employerId2 = res2['1']['0'].id; console.log(res2); console.log(this.employerId2)});
              console.log(this.financialDetails);
              if (this.financialDetails.employer_relation.id === this.financialDetails.pay_employer_relation.id){
                this.displayMasav = true;
              }
              if(this.financialDetails != null && this.financialDetails.payment_time === 'no_payment'){
                this.isNoPaymentTime = true;
                if(this.financialDetails.payment_time_validity === 'month'){
                  this.openDatePicker = true;
                }
              }
            }
          });

     }
    for(let i=0;i<this.financialDetails.financial_product.length;i++)
    {
      if(this.financialDetails.financial_product[i].additional_payment_amount>0)
        this.arrShow.push(true)
      else
        this.arrShow.push(false)
    }
  }
  addProductRow() {
    let productTemp = new EmployerFinancialProduct();
    productTemp.financial_payments=new Array<EmployerFinancialPayments>(1);
    productTemp.financial_payments[0]=new EmployerFinancialPayments();
    this.financialDetails.financial_product.push(productTemp);
    console.log(this.financialDetails.financial_product);
    console.log(this.financialDetails.financial_product);
    this.arrShow.push(false);
    console.log(this.arrShow);
  }
  deleteProductRow(index: number) {
    this.financialDetails.financial_product.splice(index, 1);
    this.arrShow.splice(index,1);
    console.log(this.arrShow)
    console.log(this.financialDetails.financial_product)
  }
  addPaymentRow(index: number) {
    this.financialDetails.financial_product[index].financial_payments.push(new EmployerFinancialPayments());
  }
  deletePaymentRow(index1: number, index2: number) {
    this.financialDetails.financial_product[index1].financial_payments.splice(index2, 1);
  }
  displayCheckedAdditional(product: any): boolean {
    if (product.additional_payment_amount > 0 && product.additional_payment_desc != null) {
      return true;
    } else {
      return false;
    }
  }
  showAdditionalPayment(index: number, isChecked: boolean): void {
    if (isChecked) {
      this.rowIndex = index;
      this.arrShow[index]=true;
    } else {
      this.arrShow[index]=false;
      this.financialDetails.financial_product[index].additional_payment_amount = 0;
      this.financialDetails.financial_product[index].additional_payment_desc = "";
    }
  }
  showNoPaymentTime(): void {
  }
  selectDueDate(): void {
  }
  addEstablishing(isChecked: boolean): void {
    if (isChecked) {
      this.isEstablishingPayment = true;
    } else {
      this.isEstablishingPayment = false;
    }
  }
  changeIsZero(product,check: boolean){
    this.financialDetails.financial_product.find(x=>x.id==product.id).is_zero=check
  }
  changeShowDetails(product,check: boolean){
    this.financialDetails.financial_product.find(x=>x.id==product.id).show_details=check
  }

  submit(form: NgForm) {
    this.hasServerError = false;
    console.log(this.financialDetails);
    if(form.valid) {
       if(this.selectUnit.getEmployerID() === 0) {
        this.notificationService.error('לא נבחר מעסיק.');
      } else {
          this.EmployerService.saveFinancialDetails(this.selectUnit.getEmployerID(),this.financialDetails)
            .then(response => {
              if(response['message'] !== 'success'){
                this.hasServerError = true;
              } else{

                this.notificationService.success('נשמר בהצלחה');
                this.fetchItems();
              }
            });
        }
      }
    }
}
