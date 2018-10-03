import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatChipsModule, MatDialogRef } from '@angular/material';

import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { FeedbackEmployeeTableDetailsComponent } from '../feedback-employee-table-details/feedback-employee-table-details.component';

import { FeedbackService } from '../../../shared/_services/http/feedback.service';
import { GeneralHttpService } from '../../../shared/_services/http/general-http.service';

import { MONTHS } from '../../../shared/_const/months';
import { FileFeedback } from '../../../shared/_models/file-feedback.model';
import { EmployeeFeedback } from '../../../shared/_models/employee-feedback.model';

import { Select2OptionData } from 'ng2-select2/ng2-select2.interface';
import { PaginationData } from '../../../shared/_models/pagination-data.model';
import { Subscription } from "rxjs/Subscription";
import { Employer } from "../../../shared/_models/employer.model";
import { Select2Options } from '../../../shared/_const/select2-options';
@Component({
  selector: 'app-feedback-employee-table',
  templateUrl: './feedback-employee-table.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', './feedback-employee-table.componen.css']
})
export class FeedbackEmployeeTableComponent extends DataTableComponent implements OnInit, OnDestroy {


  chips: Select2OptionData[] = [];
  select2Options = Select2Options;
  manufacturers: Select2OptionData[] = [];
  statuses: Select2OptionData[] = [];
  products: Select2OptionData[] = [];
  employees: Select2OptionData[] = [];
  paginationData: PaginationData;
  fileCodes: Select2OptionData[] = [];
  feedback = new FileFeedback;
  FilterBlockView: boolean;
  selectedValue: string;
  selectedMonthValue: number;
  selectedYearValue: number;
  activeFilter: '' | 'manufacturerId' | 'employeeID' | 'fileCodeId';
  isLoadingData = false;
  class:string='';
  mode: 'standard' | 'rejected' = 'standard';
  public checklist: { EmployeeFeedbackId: number }[] = [];

  /* public checkBoxValue: boolean = false;*/
  readonly months = MONTHS;
  readonly currentYear = new Date().getFullYear();

  routeSubscription: Subscription;

  constructor(protected route: ActivatedRoute, private dialog: MatDialog, private generalService: GeneralHttpService,private router: Router,
    private feedbackService: FeedbackService) {
    super(route);
  }

  ngOnInit() {

    this.searchCriteria['page'] = 1;
    if (this.route.snapshot.url[0].path === 'rejected') {
      this.mode = 'rejected';
    }
    this.FilterBlockView = false;
    const employerId = sessionStorage.getItem('EmployerID');
    //this.employers = this.route.snapshot.data['employers'];
    if (employerId) {
      this.searchCriteria['employerId'] = +employerId;

    }
    /*const employerID = this.route.snapshot.queryParams['employerId'];
    if (employerID) {
      this.searchCriteria['employerID'] = +employerID;
       sessionStorage.setItem('EmployerID',employerID);
    } */

    const year = this.route.snapshot.queryParams['year'];
    const month = this.route.snapshot.queryParams['month'];
    const fileCodeId = this.route.snapshot.queryParams['fileCodeId'];
    if (year && month && fileCodeId) {
      this.searchCriteria['month'] = +month;
      this.searchCriteria['year'] = +year;
      this.searchCriteria['fileCodeId'] = +fileCodeId;
    } else {
      const currentMonth = new Date().getMonth() + 1;
      if (currentMonth === 1) {
        this.searchCriteria['year'] = +this.currentYear - 1;
        this.searchCriteria['month'] = 12;
      } else {
        this.searchCriteria['year'] = +this.currentYear;
        this.searchCriteria['month'] = +currentMonth - 1;
      }
    }
    this.selectedMonthValue = this.searchCriteria['month'];
    this.selectedYearValue = this.searchCriteria['year'];
    this.route.queryParams.subscribe(params => this.setCriteria(params));
    this.RemoveParamsurl();
    super.ngOnInit();
    this.pageSubscription = this.route.queryParams.subscribe((message) => {
      if (message['page']) {
        console.log("FeedbackEmployeeTableComponent-page");
        this.paginateItems();
      }

    });


  }
  searchselect(){
     this.searchCriteria['page'] = 1;
    this.RemoveParamsurl();
    this.search();
  }
  RemoveParamsurl() {
    let index = this.router.url.indexOf("?");
    if (index > -1) {
      let url: string = this.router.url.substring(0, index);
      this.router.navigateByUrl(url);
    }
  }
  /*SendApplications(){

    let list: EmployeeFeedback []=[];
    this.checklist.forEach(element => {
     list.push(this.items.find(x=>x.id==element.EmployeeFeedbackId));
    });
    this.openDetailsDialog(list);
  }*/
  OpenFilter() {
    this.FilterBlockView = !this.FilterBlockView;
  }
  ClearAll() {
    if (this.chips.length > 0) {
      this.chips.pop();
      this.searchCriteria['fileCodeId'] = -1;
    }
    this.searchCriteria['statusId'] = -1;
    this.searchCriteria['month'] = -1;
    this.searchCriteria['manufacturerId'] = -1;
    this.selectedMonthValue = -1;
    this.searchCriteria['productTypeId'] = -1;
    this.RemoveParamsurl();
    this.searchCriteria['page'] = 1;
    this.setCriteria(this.searchCriteria);
  }
  changeStyle($event){
      this.class ='pointer';
  }
  setEmployer(employer: Employer) {
    this.searchCriteria['employerId'] = +employer.id;
    this.searchCriteria['page'] = 1;
    this.RemoveParamsurl();
    this.ClearSearch();
  }
  private setCriteria(params: Object): void {
    for (const param in params) {
      if (params[param]) {
        if (param === 'months') {
          this.searchCriteria['months'] = JSON.parse(params['months']);
        } else {
          this.searchCriteria[param] = params[param];
        }
      }
    }

  }

  fetchItems(): void {
    this.feedbackService.getEmployeeFeedbacks(this.searchCriteria).then(response => this.setItems(response));
  }

  setItems(response: any): void {
    this.isSearching = false;
    this.isLoadingData = true;
    this.products = response.products;
    this.statuses = response.statuses;
    this.items = response.feedbacks;
    this.paginationData = response.paginationData;

    if (this.activeFilter !== 'manufacturerId') {
      this.manufacturers = this.setSelect2Data(response['manufacturers'], 'בחר חברה מנהלת');
    }
    if (this.activeFilter !== 'fileCodeId') {
      this.fileCodes = this.setSelect2Data(response['fileCodes'], 'בחר קוד קובץ');
      if (this.searchCriteria['fileCodeId']) {
        this.selectedValue = this.searchCriteria['fileCodeId'];
      }
    }

    if (this.selectedValue != "-1" && this.selectedValue != "0" && this.selectedValue && this.chips.length == 0)
      this.chips.push(this.fileCodes.find(x => x.id == this.selectedValue));

    if (this.activeFilter !== 'employeeID') {
      this.employees = this.setSelect2Data(response['employees'], 'חפש לפי שם/תז');
    }

    setTimeout(() => this.isLoadingData = false, 0);
  }
  remove(item) {
    this.chips.splice(item, 1);
     this.RemoveParamsurl();
    this.searchCriteria['fileCodeId'] = -1;
    this.searchCriteria['page'] = 1;
    this.activeFilter = '';
    this.search();
  }
  paginateItems(): void {

    this.fetchItems();
  }
  SearchYear(Year: number): void {
    this.searchCriteria['year'] = Year;
    if (this.chips.length > 0) {
      this.chips.pop();
      this.searchCriteria['fileCodeId'] = -1;
    }
    this.RemoveParamsurl();
    this.search();
  }
  setMonths(month: number): void {
    this.searchCriteria['month'] = month;
    this.searchCriteria['page'] = 1;
     this.RemoveParamsurl();
    if (this.chips.length > 0) {
      this.chips.pop();
      this.searchCriteria['fileCodeId'] = -1;

    }

    this.search();
  }

  openDetailsDialog(feedback: EmployeeFeedback,app: boolean=false ): void {

    if(app){
    this.dialog.open(FeedbackEmployeeTableDetailsComponent, {
      width: '900px',
      data: {
        feedback: feedback,
        employerId: +this.searchCriteria['employerID'],
        dialogStep:2
      }
    });
    }
    else{
    this.dialog.open(FeedbackEmployeeTableDetailsComponent, {
      width: '900px',
      data: {
        feedback: feedback,
        employerId: +this.searchCriteria['employerID'],
        dialogStep:0
      }
    });
    }





  ///this.dialogRef.afterClosed().subscribe((response) => {if (response) this.ngOnInit()})

    this.dialog.afterAllClosed.subscribe(result => {
      console.log("asdasdasdasd");
      
      this.fetchItems();
    });
    //this.dialog._afterAllClosed(x=> this.fetchItems());
    
  }

  getEnumLabel(key: number, enumStr: 'status' | 'productType'): string {
    if (enumStr === 'status') {
      return EmployeeFeedback.statusLabel.get(key);
    }
    if (enumStr === 'productType') {
      return EmployeeFeedback.productTypeLabel.get(key);
    }
  }

  getMonthLabel(date: string): string {
    const d: Date = new Date(date);
    return this.months[d.getMonth()];
  }

  setSearch(name: 'manufacturerId' | 'employeeID' | 'fileCodeId', value: number): void {
      this.RemoveParamsurl();
    this.searchCriteria['page'] = 1;
    if (value !== 0) {
      this.activeFilter = name;

      if (this.isLoadingData) {
        return;
      }
      this.searchCriteria[name] = value
      this.search();
    }
  }

  private setSelect2Data(values: Object[], textLabel: string): Select2OptionData[] {

    const data = [
      { id: '0', text: textLabel },
      { id: '-1', text: 'הכל' }
    ];

    for (let i = 0; i < values.length; i++) {
      data[i + 2] = { id: values[i]['id'], text: values[i]['text'] };
    }



    return data;
  }

  ClearSearch(keyCode?: number): void {
    this.activeFilter = null;
    this.searchCriteria['manufacturerId'] = -1;
    this.searchCriteria['employeeID'] = -1;
    this.searchCriteria['fileCodeId'] = -1;
    super.search(keyCode);
  }

  newSearch(keyCode?: number): void {
    this.activeFilter = null;
    this.searchCriteria['manufacturerId'] = -1;
    this.searchCriteria['employeeID'] = -1;
    this.searchCriteria['page'] = 1;
    if (this.chips.length == 0)
      this.searchCriteria['fileCodeId'] = -1;
    super.search(keyCode);
  }



  /*initChecklist(data) {
    for (var i = 0; i < data.length; i++) {
      this.checklist.push({ fileId: data[i].id });
    }
  }*/
  /*
    IndexList(i) {
      let x = this.checklist.filter(x => x.EmployeeFeedbackId == i);
      if (x.length == 0) {
        this.checklist.push({ EmployeeFeedbackId: i });
      }
      else
        this.checklist.splice(this.checklist.findIndex(x => x.EmployeeFeedbackId === i), 1)
    }
  
    clearSelectAllIndexList() {
  
      if (this.checkBoxValue) {
        for (var i = 0; i < this.items.length; i++) {
          // this.checklist.push({ fileId: this.payments[i].fileId });
          this.checklist.push({ EmployeeFeedbackId: this.items[i].id });
        }
      }
      else {
        this.checklist = [];
      }
    }
    /*ngOnDestroy() {
      this.routeSubscription.unsubscribe
    }*/
}
