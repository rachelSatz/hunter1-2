import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';

import { CompensationService } from 'app/shared/_services/http/compensation.service';

import { ProductType } from 'app/shared/_models/product.model';

@Component({
  selector: 'app-compensation',
  templateUrl: './compensation.component.html',
  styleUrls: ['./compensation.component.css']
})
export class CompensationComponent extends DataTableComponent implements OnInit {

  employees = [];
  companies = [];
  // productTypes = Object.values(ProductType);

  readonly headers = [
    { column: 'createdAt', label: 'תאריך יצירת בקשה' }, { column: 'user', label: 'יוצר הבקשה' },
    { column: 'employer', label: 'מעסיק' }, { column: 'employee', label: 'עובד' },
    { column: 'personalID', label: 'ת"ז' }, { column: 'company', label: 'חברה מנהלת' },
    { column: 'productType', label: 'סוג מוצר' }, { column: 'validityDate', label: 'תאריך נכונות' },
    { column: 'sentTo', label: 'מקור המידע' }, { column: 'fullName', label: 'סטטוס' },
    { column: 'fullName', label: 'העבר לטיפול' }, { column: 'fullName', label: 'הערות' },
    { column: 'fullName', label: 'הורדה' }, { column: 'fullName', label: 'פרטים' },
    { column: 'fullName', label: 'בקשה' }, { column: 'fullName', label: 'תקינות' }
  ];

  constructor(protected route: ActivatedRoute, private compensationService: CompensationService) {
    super(route);
  }

  fetchItems(): void {
    this.compensationService.getCompensations().then(response => this.setItems(response));
  }

}
