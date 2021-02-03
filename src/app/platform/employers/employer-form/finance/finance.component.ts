import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { fade } from '../../../../shared/_animations/animation';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerService } from '../../../../shared/_services/http/employer.service';
import { NotificationService } from '../../../../shared/_services/notification.service';
import {
  CURRENCY,
  EmployerFinancialDetails,
  EmployerFinancialPayments,
  EmployerFinancialProduct,
  LANGUAGE,
  NO_PAYMENT_TIME,
  PAYMENT_METHOD,
  PAYMENT_TERMS,
  PAYMENT_TIME,
  PAYMENT_TYPE,
  PRODUCT_TYPES_SMARTI, PRODUCT_TYPES_MYHR,
  TAX
} from '../../../../shared/_models/employer-financial-details.model';
import { Employer } from '../../../../shared/_models/employer.model';
import { SelectUnitService } from '../../../../shared/_services/select-unit.service';
import { UserSessionService } from '../../../../shared/_services/http/user-session.service';
import { GeneralService } from '../../../../shared/_services/http/general.service';
import { HelpersService } from '../../../../shared/_services/helpers.service';
import {PROJECT_GROUP} from '../../../../shared/_models/project.model';



@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css'],
  animations: [fade]
})

export class FinanceComponent implements OnInit {

  paymentTypesItems = Object.keys(PAYMENT_TYPE).map(function(e) {
    return { id: e, name: PAYMENT_TYPE[e] };
  });
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
  productTypesItems = [];
  employerRelationId: number;
  rowIndex: number;
  isNoPaymentTime: boolean;
  openDatePicker: boolean;
  displayMasav: boolean;
  arrShow: Array<boolean> = new Array<boolean>();
  arrShow2: Array<boolean> = new Array<boolean>();
  banks = [];
  isEstablishingPayment: boolean;
  financialDetails: EmployerFinancialDetails = new EmployerFinancialDetails();
  payEmployers: Employer[];
  hasServerError: boolean;
  productTemp: EmployerFinancialProduct;
  bankBranchesDeposit = [];

  constructor(private route: ActivatedRoute,
              public router: Router,
              private employerService: EmployerService,
              private notificationService: NotificationService,
              private selectUnit: SelectUnitService,
              public userSession: UserSessionService,
              private generalService: GeneralService,
              private helpers: HelpersService) {
  }

  ngOnInit() {
    if (+this.selectUnit.getProjectGroupId() === PROJECT_GROUP.SMARTI) {
      this.productTypesItems = Object.keys(PRODUCT_TYPES_SMARTI).map(function (e) {
        return { id: e, name: PRODUCT_TYPES_SMARTI[e] };
      });
    }
    if (+this.selectUnit.getProjectGroupId() === PROJECT_GROUP.MYHR) {
      this.productTypesItems = Object.keys(PRODUCT_TYPES_MYHR).map(function (e) {
        return { id: e, name: PRODUCT_TYPES_MYHR[e] };
      });
    }
    this.employerService.getEmployers()
      .then(res => {
        this.payEmployers = res['data'];
        this.fetchItems();
      }
  );
 }

    fetchItems() {
      this.loadBanks();
      this.employerRelationId = this.selectUnit.getEmployerRelation();
      this.helpers.setPageSpinner(true);
      this.employerService.getEmployerFinance(this.employerRelationId)
          .then(res => {
            this.helpers.setPageSpinner(false);
            if (res.id) {
              this.financialDetails = res;
              if (this.financialDetails.employer_relation.id === this.financialDetails.pay_employer_relation.id) {
                this.displayMasav = true;
              }
              if (this.financialDetails != null && this.financialDetails.payment_time === 'no_payment') {
                this.isNoPaymentTime = true;
                if (this.financialDetails.payment_time_validity === 'month') {
                  this.openDatePicker = true;
                }
              }
            }
          });

    for (let i = 0; i < this.financialDetails.financial_product.length; i++) {
      if (this.financialDetails.financial_product[i].additional_payment_amount > 0) {
        this.arrShow.push(true);

      } else {
        this.arrShow.push(false);
      }
    }
  }

  loadBanks(): void {
    this.generalService.getBanks(true).then(banks => {
      this.banks = banks;
    });
  }

  selectedBankBranch(val?: string): void {
    const  bankId = this.financialDetails['bank_id'];
    const  branchId = this.financialDetails['branch_id'];
    const selectedBank = this.banks.find(bank => {
      return +bank.id === +bankId;
    });
    if (!selectedBank.bank_branches.find( b => {
      return +b.id === +branchId; })) {
        this.financialDetails['branch_id'] = 0;
    }
      this.bankBranchesDeposit = selectedBank ? selectedBank.bank_branches : [];
  }

  addProductRow() {
    this.productTemp = new EmployerFinancialProduct();
    this.productTemp.financial_payments = new Array<EmployerFinancialPayments>(1);
    this.productTemp.financial_payments[0] = new EmployerFinancialPayments();
    this.financialDetails.financial_product.push(this.productTemp);
    this.arrShow.push(false);
    this.arrShow2.push(false);
  }

  deleteProductRow(index: number) {
    this.financialDetails.financial_product.splice(index, 1);
    this.arrShow.splice(index, 1);
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
      this.arrShow[index] = true;
    } else {
      this.arrShow[index] = false;
      this.financialDetails.financial_product[index].additional_payment_amount = 0;
      this.financialDetails.financial_product[index].additional_payment_desc = '';
    }
  }

  showNoPaymentTime(): void {
    if (this.financialDetails.payment_time !== undefined && this.financialDetails.payment_time === 'no_payment') {
      this.isNoPaymentTime = true;
    } else {
      this.isNoPaymentTime = false;
      this.financialDetails.payment_time_validity = null;
      this.financialDetails.payment_due_date = null;
    }
  }

  selectDueDate(): void {
    if (this.financialDetails.payment_time_validity !== undefined && this.financialDetails.payment_time_validity === 'month') {
      this.openDatePicker = true;
    } else {
      this.openDatePicker = false;
      this.financialDetails.payment_due_date = null;
    }
  }

  addEstablishing(isChecked: boolean): void {
    if (isChecked) {
      this.isEstablishingPayment = true;
    } else {
      this.isEstablishingPayment = false;
      this.financialDetails.est_payment_type = this.paymentTypesItems[0].id;
      this.financialDetails.est_payment_amount = 0;
      this.financialDetails.est_ids_count = 0;
    }
  }

  changeIsZero(product, check: boolean) {
    this.financialDetails.financial_product.find(x => x.id === product.id).is_zero = check;
  }

  changeShowDetails(product, check: boolean) {
    this.financialDetails.financial_product.find(x => x.id === product.id).show_details = check;
  }

  submit(form: NgForm) {
    this.hasServerError = false;
    if (form.valid) {
       if (this.selectUnit.getEmployerRelation() === 0) {
        this.notificationService.error('לא נבחר מעסיק.');
      } else {
          this.employerService.saveFinancialDetails(this.selectUnit.getEmployerRelation(), this.financialDetails)
            .then(response => {
              if (response['message'] !== 'success') {
                this.hasServerError = true;
              } else {
                this.notificationService.success('נשמר בהצלחה');
                this.fetchItems();
              }
            });
        }
      }
    }

  changeExceptionAmount(product: EmployerFinancialProduct): void {
    const payment = product.financial_payments[product.financial_payments.length - 1];
    if (isNaN(payment.payment_amount / + payment.ids_count)) {
      product.exception_amount = 0;
    } if (payment.ids_count === '0' || payment.ids_count === '') {
      product.exception_amount = 0;
    } else { product.exception_amount = + payment.payment_amount / + payment.ids_count; }
  }
}
