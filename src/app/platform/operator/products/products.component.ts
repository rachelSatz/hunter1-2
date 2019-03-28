import { ActivatedRoute } from '@angular/router';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import { ProductService } from 'app/shared/_services/http/product.service';
import { placeholder, slideToggle } from 'app/shared/_animations/animation';
import { ExtendedProduct, ProductType } from 'app/shared/_models/product.model';
import { DataTableComponent } from 'app/shared/data-table-1/data-table.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './products.component.css'],
  animations: [ slideToggle, placeholder ]

})
export class ProductsComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  products: any;
  typesLabels = ProductType;
  types = Object.keys(ProductType).map(function(e) {
    return { id: e, name: ProductType[e] };
  });

  readonly columns =  [
    { name: 'company_name', label: 'שם חברה מנהלת', searchable: false},
    { name: 'name', label: 'שם קופה', searchable: false},
    { name: 'type', label: 'סוג קופה', searchOptions: { labels: this.types } },
    { name: 'code', label: 'מספר קופה באוצר', searchable: false},
    { name: 'company_code', label: 'ח.פ. חברה מנהלת', searchable: false}
  ];
  constructor(protected route: ActivatedRoute,
              protected notificationService: NotificationService,
              public productService: ProductService) {
  }

  ngOnInit() {
    this.fetchItems();
  }

  fetchItems() {
    this.dataTable.criteria.filters['limit'] =  this.dataTable.limit;
    this.productService.getAllProducts(this.dataTable.criteria).then(response => {
      // this.setItems(response);
      this.setResponse(response);
      this.products = response;
    });
  }

  setResponse(response: any): void {
    this.dataTable.setItems(response);
  }
  ngOnDestroy(): void {
  }
}



