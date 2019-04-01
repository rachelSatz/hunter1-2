import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { NgForm } from '@angular/forms';

import { EmployerProductBankAccount } from 'app/shared/_models/employer-product-bank-account';
import { NotificationService } from 'app/shared/_services/notification.service';
import  {SelectUnitService } from 'app/shared/_services/select-unit.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { Company } from 'app/shared/_models/company.model';




@Component({
  selector: 'app-defrayal-form',
  templateUrl: './defrayal-form.component.html'
})
export class DefrayalFormComponent implements OnInit {

  employerProductBankAccount = new EmployerProductBankAccount;
  companies: Company[] = [];
  products = [];
  bankAccounts = [];
  navigate: any;
  location: string;
  id: number;

  constructor(private route: ActivatedRoute ,
              private router: Router,
              private employerService: EmployerService,
              private selectUnit: SelectUnitService,
              private notificationService: NotificationService) { }

  ngOnInit() {
    if (this.router.url.includes( 'employers')) {
      this.navigate = ['platform', 'employers',
        'form', this.selectUnit.currentEmployerID, 'defrayal'];
      this.location = 'employers';
    }
    else if (this.router.url.includes( 'operator')) {
      this.location = 'operator';
      this.navigate = ['platform', 'operator', 'defrayal'];
    } else {
      this.navigate = ['platform', 'defrayal'];
      this.location = 'settings';
    }
    this.companies = this.selectUnit.getCompanies();
    if (this.route.snapshot.data.employerBankAccount) {
      this.employerProductBankAccount = this.route.snapshot.data.employerBankAccount;
    }
  }

  selectedBankAccounts(): void {
    this.bankAccounts = this.products.find(c => c.id == this.employerProductBankAccount.product_id).bank_account;
    if ( !this.bankAccounts.some(b => b.id == this.employerProductBankAccount.bank_account_id))
      this.employerProductBankAccount.bank_account_id = 0;
  }

  selectedProducts(): void {
    this.products = this.companies.find(c => c.id === this.employerProductBankAccount.company_id).product;
    if ( !this.products.some(p => p.id === this.employerProductBankAccount.product_id)) {
      this.employerProductBankAccount.product_id = 0;
      this.employerProductBankAccount.bank_account_id = 0;
    }
  }

  submit(form: NgForm): void {
    if (form.valid) {
      if ( this.location !== 'operator'){
        // this.employerId = this.selectUnit.currentEmployerID;
      }
      this.employerService.setDefaultEmployerBA(this.selectUnit.currentEmployerID,  this.employerProductBankAccount)
        .then(response =>  {
            if (response === 'ok') {
              this.router.navigate(this.navigate);
            } else {
              const c = response === 'exists' ? 'קיים בנק דיפולט לקופה זו' : 'בקשה נכשלה';
              this.notificationService.error('', c);
            }
        });
    }
  }
}
