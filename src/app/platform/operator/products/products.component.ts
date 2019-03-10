import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { ProductService } from 'app/shared/_services/http/product.service';
import { placeholder, slideToggle } from 'app/shared/_animations/animation';
import { ExtendedProduct, ProductType } from 'app/shared/_models/product.model';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './products.component.css'],
  animations: [ slideToggle, placeholder ]

})
export class ProductsComponent extends DataTableComponent implements OnInit, OnDestroy {
  products: ExtendedProduct[];
  types = Object.keys(ProductType).map(function(e) {
    return { id: e, name: ProductType[e] };
  });

  readonly headers: DataTableHeader[] =  [
    { column: 'company_name', label: 'שם חברה מנהלת' },
    { column: 'product_name', label: 'שם קופה' },
    { column: 'product_code', label: 'מספר קופה באוצר' },
    { column: 'company_code', label: 'ח.פ. חברה מנהלת' }
  ];
  constructor(protected route: ActivatedRoute,
              protected notificationService: NotificationService,
              public productService: ProductService) {
    super(route);
  }

  ngOnInit() {
    this.fetchItems();
    super.ngOnInit();
  }

  fetchItems() {
    this.productService.getAllProducts(this.searchCriteria).then(response => {
      this.setItems(response);
      this.products = response;
    });
  }

  OnDestroy() {
    super.ngOnDestroy();
  }
}



