import { NgForm} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { fade } from 'app/shared/_animations/animation';
import { BankAccount} from 'app/shared/_models/bank.model';
import { ExtendedProduct} from 'app/shared/_models/product.model';
import { ProductService} from 'app/shared/_services/http/product.service';
import { GeneralHttpService} from 'app/shared/_services/http/general-http.service';

@Component({
  selector: 'app-product-from',
  templateUrl: './product-form.component.html',
  styles: [`.check-module { width: 140px; }` ],
  animations: [ fade ]
})
export class ProductFormComponent implements OnInit {
  hasServerError: boolean;

  entities = [];
  product = new ExtendedProduct;
  banks = [];
  bankBranchesDeposit = [];
  checked: boolean;

  constructor(private route: ActivatedRoute, private productService: ProductService,
              private router: Router,
              private generalService: GeneralHttpService) { }

  ngOnInit() {
    this.loadBanks();
    if (this.route.snapshot.data.product) {
      this.product = this.route.snapshot.data.product.data;
      if (this.product.bank_account === null || this.product.bank_account.length === 0) {
        this.product.bank_account.push(new BankAccount());
      }
    }
    this.loadEntities();
  }

  loadEntities(): void {
      this.productService.getCompanies().then(response => this.entities = response);
  }

  loadBanks(): void {
    this.generalService.getBanks(true).then(banks => {
      this.banks = banks;
    });
  }

  addBankRow(index: number): void {
    this.product.bank_account.push(new BankAccount());
  }

  selectedBankBranch(index?: number): void {
    const bankId = this.product.bank_account[index].bank_id;
    const branchId = this.product.bank_account[index].branch_id;

    const selectedBank = this.banks.find(bank => {
      return +bank.id === +bankId;
    });

     if (!selectedBank.bank_branches.find( b => {
      return +b.id === +branchId; })) {
      this.product.bank_account[index].branch_id = 0;
    }

      this.bankBranchesDeposit = selectedBank ? selectedBank.bank_branches : [];

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
      if (this.product.id) {
        this.productService.updateProduct(this.product.id, form.value)
          .then(response => this.handleResponse(response));
      } else {
          this.productService.saveProduct(form.value).
          then(response => this.handleResponse(response));
      }
    }
  }
  private handleResponse(isSaved: boolean): void {
    if (isSaved) {
      this.router.navigate(['platform', 'operator', 'products']);
    } else {
      this.hasServerError = true;
    }
  }

}
