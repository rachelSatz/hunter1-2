import {Component, OnDestroy, OnInit} from '@angular/core';
import {placeholder, slideToggle} from '../../../shared/_animations/animation';
import {DataTableComponent} from '../../../shared/data-table/data-table.component';
import {ActivatedRoute} from '@angular/router';
import {NotificationService} from '../../../shared/_services/notification.service';
import {MatDialog} from '@angular/material';
import {DataTableHeader} from '../../../shared/data-table/classes/data-table-header';
import {ProductService} from '../../../shared/_services/http/product.service';
import {CompaniesProduct} from '../../../shared/_models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './products.component.css'],
  animations: [ slideToggle, placeholder ]

})
export class ProductsComponent extends DataTableComponent implements OnInit, OnDestroy {
  products: CompaniesProduct[];

  readonly headers: DataTableHeader[] =  [
    { column: 'created_at', label: 'שם חברה מנהלת' },
    { column: 'updated_at', label: 'שם קופה' },
    { column: 'username', label: 'מספר קופה באוצר' },
    { column: 'employer_name', label: 'ח.פ. חברה מנהלת' }
  ];
  constructor(protected route: ActivatedRoute,
              protected notificationService: NotificationService,
              public productService: ProductService,
              private dialog: MatDialog) {
    super(route);
  }

  ngOnInit() {
    this.fetchItems();
    super.ngOnInit();
  }

  fetchItems(): void {
    this.productService.getAllProducts(this.searchCriteria).then(response => {
      this.setItems(response);
      this.products = response;
    });
  }
}



