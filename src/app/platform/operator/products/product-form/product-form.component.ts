import { Component, OnInit } from '@angular/core';
import { fade } from '../../../../shared/_animations/animation';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../../shared/_services/http/product.service';
import {ExtendedProduct, Product} from '../../../../shared/_models/product.model';
import {EntityTypes} from '../../../../shared/_models/contact.model';
import {NgForm} from '@angular/forms';
import {GeneralHttpService} from '../../../../shared/_services/http/general-http.service';
import {BankAccount} from '../../../../shared/_models/bank.model';
import {EmployerFinancialProduct} from '../../../../shared/_models/employer-financial-details.model';

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
  isEdit = false;
  bankBranchesDeposit = [];
  entityTypes = Object.keys(EntityTypes).map(function(e) {
    return { id: e, name: EntityTypes[e] };
  });
  constructor(private route: ActivatedRoute, private productService: ProductService,
              private router: Router,
              private generalService: GeneralHttpService) { }

  ngOnInit() {
    this.loadBanks();
    if (this.route.snapshot.data.product) {
      this.product = this.route.snapshot.data.product.data;
      // if (this.product.bank_account == null) {
      //   this.product.bank_account = new BankAccount[];
      // }
    }

    if (this.product.id) {
      this.loadEntities();
    }
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
  // selectedBankBranch(val?: string): void {
  //   const  bankId = this.product.bank_account.bank_id;
  //   const  branchId = this.product.bank_account.branch_id;
  //
  //   const selectedBank = this.banks.find(bank => {
  //     return +bank.id === +bankId;
  //   });
  //
  //   if (!selectedBank.bank_branches.find( b => {
  //     return +b.id === +branchId; })) {
  //       this.product.bank_account.branch_id = 0;
  //   }
  //   if (val === 'Withdrawal') {
  //     this.bankBranchesDeposit = selectedBank ? selectedBank.bank_branches : [];
  //   }
  // }
  submit(form: NgForm): void {
    this.hasServerError = false;
    if (form.valid) {
      // if (this.product.id) {
      //   this.productService.updateProduct(form.value, this.contact.id).then(response => this.handleResponse(response));
      // } else {
      //     this.productService.newProduct(form.value, ).
      //     then(response => this.handleResponse(response));
      // }
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
