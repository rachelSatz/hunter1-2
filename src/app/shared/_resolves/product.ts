import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ExtendedProduct} from '../_models/product.model';
import { ProductService } from '../_services/http/product.service';

@Injectable()
export class ProductResolve implements Resolve<ExtendedProduct> {

  constructor(private productService: ProductService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.productService.getProduct(+snapshot.params.id).then(response => response as ExtendedProduct);
  }
}
