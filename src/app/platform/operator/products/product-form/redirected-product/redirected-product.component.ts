import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ProductService} from '../../../../../shared/_services/http/product.service';

@Component({
  selector: 'app-redirected-product',
  templateUrl: './redirected-product.component.html'
})
export class RedirectedProductComponent implements OnInit {
  redirectedProducts = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<RedirectedProductComponent>,
              private productService: ProductService) { }

  ngOnInit() {
    this.productService.getRedirectedProduct(this.data.productId).then(reponse =>
      this.redirectedProducts = reponse
    );
  }

  deleteRedirectedProduct(redirectedProductCode: string ): void {
    this.productService.deleteRedirectedProduct(redirectedProductCode).then(response => {
      if (response) {
      }
    });
  }

  addRedirectedProduct(redirectedProductCode: string ): void {
    this.productService.addRedirectedProduct(redirectedProductCode, this.data.productId).then(response => {
      if (response) {
      }
    });
  }
}
