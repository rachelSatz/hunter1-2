import { NgForm} from '@angular/forms';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { fade } from 'app/shared/_animations/animation';
import { BankAccount} from 'app/shared/_models/bank.model';
import { ProductService} from 'app/shared/_services/http/product.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ExtendedProduct, ProductType } from 'app/shared/_models/product.model';
import { GeneralHttpService} from 'app/shared/_services/http/general-http.service';
import { RedirectedProductComponent } from './redirected-product/redirected-product.component';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { DataTableResponse } from 'app/shared/data-table/classes/data-table-response';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'app-product-from',
  templateUrl: './product-form.component.html',
  styles: ['.check-module { width: 140px; }'],
  animations: [ fade ]
})
export class ProductFormComponent implements OnInit {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;


  readonly columns =  [
    { name: 'bank', label: 'בנק', searchable: false},
    { name: 'branch_number', label: 'מס סניף', searchable: false},
    { name: 'branch', label: 'סניף', searchable: false},
    { name: 'account', label: 'חשבון'},
    { name: 'main', label: 'ראשי?', searchable: false}
  ];

  hasServerError: boolean;

  entities = [];
  product = new ExtendedProduct;
  banks = [];
  checked: boolean;
  types = Object.keys(ProductType).map(function(e) {
    return { id: e, name: ProductType[e] };
  });
  allProducts = [];
  bank_account= new BankAccount();

  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private router: Router,
              private generalService: GeneralHttpService,
              protected notificationService: NotificationService,
              private dialog: MatDialog,
              private _location: Location) { }

  ngOnInit() {
    this.loadBanks();
    if (this.route.snapshot.data.product) {
      this.product = this.route.snapshot.data.product.data;


    }
    this.loadEntities();
    this.productService.getProductsList().then(response =>
      this.allProducts = response
    );
    this.fetchItems();
  }

  fetchItems() {
    const bank_account = new DataTableResponse(this.product.bank_account, this.product.bank_account.length, 1);
    this.dataTable.criteria.limit = this.product.bank_account.length;
    this.dataTable.setItems(bank_account);
  }



  loadEntities(): void {
      this.productService.getCompanies().then(response => this.entities = response);
  }

  loadBanks(): void {
    this.generalService.getBanks(true).then(banks => {
      this.banks = banks;
    });
  }

  // addBankRow(): void {
  //   this.bank_account.push(new BankAccount());
  // }
  //
  // deleteBankRow(index: number): void {
  //   this.bank_account.splice(index, 1);
  // }

  selectedBankBranch(): any {
    const bankId = this.bank_account.bank_id;
    const branchId = this.bank_account.branch_id;

    if (this.banks.length > 0 && bankId) {
      const selectedBank = this.banks.find(bank => {
        return +bank.id === +bankId;
      });

      if (!selectedBank.bank_branches.find(b => {
        return +b.id === +branchId;
      })) {
        this.bank_account.branch_id = 0;
      }

      return selectedBank ? selectedBank.bank_branches : [];
    }
    return [];
  }

  // primaryBankChecked(index: number, isChecked: boolean): void {
  //   if (!isChecked) {
  //     this.checked = false;
  //     return;
  //   } else {
  //     this.product.bank_account.forEach( b => b.is_primary = false);
  //     this.checked = true;
  //     this.product.bank_account[index].is_primary = isChecked;
  //   }
  // }

  submit(form: NgForm): void {
    this.hasServerError = false;
    if (form.valid) {
    //   if ( this.checked ||  this.product.bank_account.some(b => b.is_primary === true)) {
      const id = this.product.id ? this.product.id : 0;
      this.productService.createUpdateProduct(id, this.product).then(response => this.handleResponse(response));
      // } else {
      //   this.notificationService.error('', 'חייב לבחור לפחות בנק אחד דיפולט');
      // }
    }
  }

  private handleResponse(response: any): void {
    const message = response['message'];
    if (message === 'success') {
      this.notificationService.success('שמירה בוצע בהצלחה');
      this.product = response['data'];
      // this.previous();
    } else {
      let mes = '';
      if (message === 'like') {
           mes = 'ישנם שתי חשבונות בנק זהים';
      } else if (message === 'code_exists') {
        mes = 'קוד קופה קיים';
      }
      this.notificationService.error('', mes);
    }
  }

  previous(): void {
    this._location.back();
  }

  openRedirectedProductDialog(productId: number): void {
    this.dialog.open(RedirectedProductComponent, {
      data: {productId : productId, allProducts: this.allProducts},
      width: '650px',
      panelClass: 'dialog-file'
    });
  }

  editBankRow(item): void {

  }

  deleteBankRow(item): void {

  }

  addProductBankAccount(form: NgForm): void {
    if (form.valid) {
      if (this.product.bank_account.length === 0 && !this.bank_account.is_primary) {
        return this.notificationService.error('חייב לבחור בנק דיפולט');
      }

      if (this.product.bank_account.some(b => b.is_primary)  && this.bank_account.is_primary) {
        const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};
        this.notificationService.warning('האם ברצונך להחליף את הבנק דיפולט?', '', buttons).then(confirmation => {
          if (!confirmation.value) {
            this.bank_account.is_primary = false;
          }
          this.productService.createUpdateProductBankAccount
          (this.product.id, this.bank_account).then(response => this.handleResponse(response));
        });
      }else {
        this.productService.createUpdateProductBankAccount
        (this.product.id, this.bank_account).then(response => this.handleResponse(response));
      }
    }
  }
}
