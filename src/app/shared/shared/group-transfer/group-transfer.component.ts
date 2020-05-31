import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';

import { fade } from 'app/shared/_animations/animation';
import { Company } from 'app/shared/_models/company.model';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { EmployerProductBankAccount } from 'app/shared/_models/employer-product-bank-account';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';


@Component({
  selector: 'app-group-transfer',
  templateUrl: './group-transfer.component.html',
  animations: [ fade ]
})
export class  GroupTransferComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<GroupTransferComponent>,
              public mtbService: MonthlyTransferBlockService,
              private selectUnit: SelectUnitService,
              private notificationService: NotificationService) { }

  employerProductBankAccount = new EmployerProductBankAccount;
  bankAccounts: any;
  products: any;
  companies: Company[] = [];
  groupId: number;
  hasServerError: boolean;
  message: string;

  ngOnInit() {
    this.companies = this.selectUnit.getCompanies();

  }

  selectedBankAccounts(): void {
    this.bankAccounts = this.products.find(c => c.id === this.employerProductBankAccount.product_id).bank_account;
    if ( !this.bankAccounts.some(b => b.id === this.employerProductBankAccount.bank_account_id)) {
      this.employerProductBankAccount.bank_account_id = this.bankAccounts ?  this.bankAccounts.find(b => b.is_primary).id : 0;
    }
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

      this.mtbService.createMtbGroup(
        this.data.ids,
        form.value.product,
        form.value.bank_account,
        form.value.group_name,
        0,
        this.data.type,
        this.data.dataTable).then(
          response => {
            if (response.groupList) {
            const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};

            this.notificationService.warning(
              '', 'קבוצה זו קימת האם ברצונך לפתוח קבוצה חדשה?', buttons).then(confirmation => {
                this.mtbService.createMtbGroup(
                  this.data.ids,
                  form.value.product,
                  form.value.bank_account,
                  form.value.group_name,
                  confirmation.value ? 1 : -1,
                  this.data.type,
                  this.data.dataTable)
                  .then(r => this.dialogRef.close());
            });

          } else if (response['message'] === 'updated finish') {
              this.notificationService.success('העידכון בוצע הצלחה');
              this.dialogRef.close();
          } else {
              this.notificationService.error('אירעה שגיאה');
            }
      });
    }
  }
}
