import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ProductService} from '../../../../../shared/_services/http/product.service';
import {NotificationService} from '../../../../../shared/_services/notification.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-redirected-product',
  templateUrl: './redirected-product.component.html',
  styleUrls: ['./redirected-product.component.css'],
})
export class RedirectedProductComponent implements OnInit {
  redirectedProducts = [];
  allProducts = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<RedirectedProductComponent>,
              private productService: ProductService,
              protected notificationService: NotificationService) { }

  ngOnInit() {
    this.productService.getRedirectedProduct(this.data.productId).then(response =>
      this.redirectedProducts = response
    );
    this.allProducts = this.data.allProducts;
  }

  deleteRedirectedProduct(redirectedProductCode: string ): void {
    this.productService.deleteRedirectedProduct(this.data.productId, redirectedProductCode).then(response => {
      if (response['message'] === 'Successfully deleted!') {
        this.dialogRef.close();
      } else {
        this.notificationService.error('', response['message']);
      }
    });
  }



  submit(form: NgForm): void {
    if (form.value['redirectedId'] !== '') {
      this.productService.addRedirectedProduct(form.value['redirectedId'], this.data.productId).then(response => {
        if (response === 'Success!') {
          this.dialogRef.close();
        } else {
          this.notificationService.error('', response);
        }
      });
    }
  }
}
