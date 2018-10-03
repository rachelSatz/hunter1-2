import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2OptionData } from 'ng2-select2';

import { DataTableComponent } from '../../../../shared/data-table/data-table.component';

import { ProcessService } from '../../../../shared/_services/http/process.service';

import { Select2Options } from '../../../../shared/_const/select2-options';
import { Product } from '../../../../shared/_models/product.model';
import { EmployeePayment } from '../../../../shared/_models/employee-payment.model';
import { Process } from '../../../../shared/_models/process.model';
import { productTypeLabel, StatusDepositLabel, SugTakbulLabel } from '../../../../shared/_const/EnumLabels';
import { PaginationData } from '../../../../shared/_models/pagination-data.model';
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-process-employee-payments',
  templateUrl: './process-employee-payments.component.html',
  styleUrls: ['../../../../shared/data-table/data-table.component.css','./process-employee-payments.component.css']
})
export class ProcessEmployeePaymentsComponent extends DataTableComponent implements OnInit , OnDestroy{

  process: Process;

  select2Options: Select2Options;

  product = new Product;
  payment = new EmployeePayment;
  paginationData: PaginationData;
  showFields = {};
  products: Select2OptionData[] = [];
  employees: Select2OptionData[] = [];
	
  filters: { id: number, text: string }[] = [];
  activeFilter:''|'productID' | 'employeeID';

  isLoadingData = false;
pageSubscription: Subscription;
  constructor(protected route: ActivatedRoute, private processService: ProcessService,private routerLink: Router,) {
    super(route);
  }

  ngOnInit() {
    this.process = this.route.parent.snapshot.data['process'].data.process;
   this.searchCriteria['page'] = 1;
    this.searchCriteria['processID'] = this.process.id;
    this.fetchItems();
     this.pageSubscription = this.route.queryParams.subscribe((message) => {
      if (message['page']) {
        console.log("employeetable-page");
        this.searchCriteria['page'] = message['page'];
        this.paginateItems();
      }

    });
    this.RemoveParamsurl();
  }
  RemoveParamsurl() {
    let index = this.routerLink.url.indexOf("?");
    if (index > -1) {
      let url: string = this.routerLink.url.substring(0, index);
      this.routerLink.navigateByUrl(url);
    }
  }
paginateItems(): void {

    this.fetchItems();
  }
  fetchItems(): void {
    this.isSearching = true;
    console.log("this.searchCriteria",this.searchCriteria);
    
    this.processService.getEmployeePayments(this.searchCriteria).then(response => {
      this.setItems(response);
      this.isSearching = false;
    });
  }

  setItems(response: Object): void {
    this.isSearching = false;

    this.isLoadingData = true;
    this.paginationData = response['paginationData'];
    this.items = response['listPayment'];
    console.log("items",this.items);
    
    this.showFields = response['listShow'];
    if (this.activeFilter !== 'productID' &&  (!this.searchCriteria.hasOwnProperty('productID') || this.searchCriteria['productID'] === "0") ) {
      this.products = this.setProductSelect2Data(response['listProduct']);
    }

    
    if (this.activeFilter !== 'employeeID' && (!this.searchCriteria.hasOwnProperty('employeeID') || this.searchCriteria['employeeID'] === "0")) {
      this.employees = this.setEmployeeSelect2Data(response['listEmployee']);
    }

    this.filters = response['ActionFilters'];
    setTimeout(() => this.isLoadingData = false, 0);
  }

  private setProductSelect2Data(values: Object[]): Select2OptionData[] {

    const data = [
      { id: '0', text: 'בחר קופה' }
    ];

    for (let i = 0; i < values.length; i++) {
      data[i + 1] = { id: values[i]['id'], text: values[i]['name'] };
    }

    return data;
  }

  private setEmployeeSelect2Data(values: Object[]): Select2OptionData[] {
    const data = [
      { id: '0', text: 'בחר עובד' }
    ];

    for (let i = 0; i < values.length; i++) {
      data[i + 1] = { id: values[i]['id'], text: values[i]['firstName'] + ' ' + values[i]['lastName'] };
    }

    return data;
  }

  setSearch(name: 'productID' | 'employeeID', value: number): void {
    this.searchCriteria['page'] = 1;
    this.activeFilter = name;

    if (this.isLoadingData) {
      return;
    }

    this.searchCriteria[name] = value;
    this.search();
  }
  searchEmployepament(){
       this.searchCriteria['page'] = 1;
       this.search();
  }
GetrouterLink(){
    let getSend = sessionStorage.getItem('Send'+this.process.id);
   const url = (this.process.pay||this.process.HaveDatevalue||getSend=='true'||this.process.NegativeProcess) ? "transmission" : "payment";
   return this.routerLink.navigate(['..', url], { relativeTo: this.route });

}
  getSugTakbulLabel(key: number): string {
    return SugTakbulLabel.get(key);
  }
  getStatusDepositLabel(key: number): string {
    return StatusDepositLabel.get(key);
  }
  getProductTypeLabel(key: number): string {
    return productTypeLabel.get(key);
  }

}
