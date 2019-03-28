import { NgForm} from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { fade } from 'app/shared/_animations/animation';
import { BankAccount} from 'app/shared/_models/bank.model';
import { ProductService} from 'app/shared/_services/http/product.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ExtendedProduct, ProductType } from 'app/shared/_models/product.model';
import { GeneralHttpService} from 'app/shared/_services/http/general-http.service';
import { RedirectedProductComponent } from './redirected-product/redirected-product.component';

@Component({
  selector: 'app-product-from',
  templateUrl: './product-form.component.html',
  styles: ['.check-module { width: 140px; }'],
  animations: [ fade ]
})
export class ProductFormComponent implements OnInit {
  hasServerError: boolean;

  entities = [];
  product = new ExtendedProduct;
  banks = [];
  bankBranchesDeposit = [];
  checked: boolean;
  types = Object.keys(ProductType).map(function(e) {
    return { id: e, name: ProductType[e] };
  });
  allProducts = [];

  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private router: Router,
              private generalService: GeneralHttpService,
              protected notificationService: NotificationService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.loadBanks();
    if (this.route.snapshot.data.product) {
      this.product = this.route.snapshot.data.product.data;
      if (this.product.bank_account === null || this.product.bank_account.length === 0) {
        this.product.bank_account.push(new BankAccount());
      }
    }
    this.loadEntities();
    this.productService.getProductsList().then(response =>
      this.allProducts = response
    );
  }

  loadEntities(): void {
      this.productService.getCompanies().then(response => this.entities = response);
  }

  loadBanks(): void {
    this.generalService.getBanks(true).then(banks => {
      this.banks = banks;
    });
  }

  addBankRow(): void {
    this.product.bank_account.push(new BankAccount());
  }

  deleteBankRow(index: number): void {
    if (!this.product.bank_account[index].id) {
      this.product.bank_account.splice(index, 1);
    } else {
      this.product.bank_account[index].is_active = false;
    }
  }

  selectedBankBranch(index?: number): any {
    const bank_account = this.product.bank_account[index];
    const bankId = bank_account.bank_id;
    const branchId = bank_account.branch_id;

    if (this.banks.length > 0 && bankId) {
      const selectedBank = this.banks.find(bank => {
        return +bank.id === +bankId;
      });

      if (!selectedBank.bank_branches.find(b => {
        return +b.id === +branchId;
      })) {
        this.product.bank_account[index].branch_id = 0;
      }

      return selectedBank ? selectedBank.bank_branches : [];
    }
    return [];
  }

  primaryBankChecked(index: number, isChecked: boolean): void {
    if (!isChecked) {
      this.checked = false;
      return;
    } else {
      this.product.bank_account.forEach( b => b.is_primary = false);
      this.checked = true;
      this.product.bank_account[index].is_primary = isChecked;
    }
  }

  submit(form: NgForm): void {
    this.hasServerError = false;
    if (form.valid) {
      if ( this.checked ||  this.product.bank_account.some(b => b.is_primary === true)) {
        const id = this.product.id ? this.product.id : 0;
        this.productService.createUpdateProduct(id, this.product).then(response => this.handleResponse(response));
      } else {
        this.notificationService.error('', 'חייב לבחור לפחות בנק אחד דיפולט');
      }
    }
  }

  private handleResponse(response: any): void {
    const message = response['message'];
    if (message === 'success') {
      this.router.navigate(['platform', 'operator', 'products']);
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

  back(): void {
    this.router.navigate(['platform', 'operator', 'products']);

  }

  openRedirectedProductDialog(productId: number): void {
    this.dialog.open(RedirectedProductComponent, {
      data: {productId : productId, allProducts: this.allProducts},
      width: '650px',
      panelClass: 'dialog-file'
    });
  }
}
