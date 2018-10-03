import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog ,MatDialogRef} from '@angular/material';
import { Select2OptionData } from 'ng2-select2/ng2-select2.interface';

import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { FeedbackFileApplicationComponent } from '../feedback-file-application/feedback-file-application.component';

import { FeedbackService } from '../../../shared/_services/http/feedback.service';

import { FileFeedback } from '../../../shared/_models/file-feedback.model';
import { Product } from '../../../shared/_models/product.model';
import { Employer } from '../../../shared/_models/employer.model';

import { MONTHS } from '../../../shared/_const/months';
import { payTypeLabel, productTypeLabel } from "../../../shared/_const/EnumLabels";
import { ApplicationCommentComponent } from "../application-comment/application-comment.component";
import { FileFeedbackError } from "../../../shared/_models/file-feedback-error";
import { Contact } from "../../../shared/_models/contact.model";
import { Application } from "../../../shared/_models/Application.model";
import { ContactService } from "../../../shared/_services/http/contact.service";
import { GeneralHttpService } from "../../../shared/_services/http/general-http.service";
import { TransmissionProductDetailsFullComponent } from "../../process/process-transmission/transmission-product-details-Full/transmission-product-details-full.component";
import { RepeatFeedbackFileApplicationComponent } from "../repeat-feedback-file-application/repeat-feedback-file-application.component";

@Component({
  selector: 'app-rejected-file',
  templateUrl: './rejected-file.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css', 
  '../feedback-file-table/feedback-file-table.component.css', './rejected-file.component.css']
})
export class RejectedFileComponent extends DataTableComponent implements OnInit {

  //employers: Employer[] = [];
  product = new Product();

  manufacturers: Select2OptionData[] = [];
  statuses: Select2OptionData[] = [];
  appSubject: Select2OptionData[] = [];
  appStatus: Select2OptionData[] = [];
  processes: Select2OptionData[] = [];
  chips: Select2OptionData[] = [];
  processesName: string;
  activeFilter: '' | 'processId';
  isLoadingData = false;

  selectedValue: string;

  selectedMonthValue: number;
  selectedYearValue: number;


  readonly statusLabels = { 'successful': 'תקין', partial: 'בטיפול', failed: 'שגוי' };
  readonly months = MONTHS;
  readonly currentYear = new Date().getFullYear();

  constructor(protected route: ActivatedRoute, private router: Router, private feedbackService: FeedbackService, private contactService: ContactService,
    private dialog: MatDialog, private generalService: GeneralHttpService) {
    super(route);
  }

  ngOnInit() {
    const employerId = sessionStorage.getItem('EmployerID');
    //this.employers = this.route.snapshot.data['employers'];
    if (employerId) {
      this.searchCriteria['employerID'] = +employerId;

    }

    const year = this.route.snapshot.queryParams['year'];
    const month = this.route.snapshot.queryParams['month'];
    const processId = this.route.snapshot.queryParams['processId'];
    if (processId) {
      this.searchCriteria['processId'] = +processId;
    }
    if (year && month && processId) {
      this.searchCriteria['months'] = [+month];
      this.searchCriteria['year'] = +year;
      this.searchCriteria['processId'] = +processId;
    } else {
      const currentMonth = new Date().getMonth() + 1;
      if (currentMonth === 1) {
        this.searchCriteria['year'] = +this.currentYear - 1;
        this.searchCriteria['months'] = [12];
      } else {
        this.searchCriteria['year'] = +this.currentYear;
        this.searchCriteria['months'] = [currentMonth - 1];
      }
    }
    this.selectedMonthValue = this.searchCriteria['months'];
    this.selectedYearValue = this.searchCriteria['year'];

    this.route.queryParams.subscribe(params => this.setCriteria(params));
    this.RemoveParamsurl();
    super.ngOnInit();
    this.pageSubscription = this.route.queryParams.subscribe((message) => {
      if (message['page']) {
        this.paginateItems();
      }

    });

  }
  RemoveParamsurl() {
    let index = this.router.url.indexOf("?");
    if (index > -1) {
      let url: string = this.router.url.substring(0, index);
      this.router.navigateByUrl(url);
    }
  }
  setEmployer(employer: Employer) {
    this.searchCriteria['page'] = 1;
    this.searchCriteria['employerID'] = +employer.id;
    if (this.chips.length > 0) {
      this.chips.pop();
      this.searchCriteria['processId'] = -1;
    }
    this.RemoveParamsurl();
    this.newSearch()
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

  paginateItems(): void {


    this.fetchItems();
  }

  fetchItems(): void {
    this.feedbackService.getErrorFileFeedbacks(this.searchCriteria).then(response => this.setItems(response));
  }

  setMonths(month: number): void {
    this.RemoveParamsurl();
    this.searchCriteria['page'] = 1;
    this.searchCriteria['months'] = month;
    this.selectedMonthValue = month;

    if (this.chips.length > 0) {
      this.chips.pop();
      this.searchCriteria['processId'] = -1;
    }
    this.newSearch();
  }

  setYear(year: number): void {
    this.RemoveParamsurl();
    this.searchCriteria['page'] = 1;
    this.searchCriteria['year'] = year;
    this.selectedYearValue = year;
    if (this.chips.length > 0) {
      this.chips.pop();
      this.searchCriteria['processId'] = -1;
    }
    this.newSearch();
  }


  getPayTypeLabel(key: number): string {
    return payTypeLabel.get(key);
  }

  getproductTypeLabel(key: number): string {
    return productTypeLabel.get(key);
  }

  setItems(response: any): void {
    this.isLoadingData = true;
    this.isSearching = false;

    this.manufacturers = response.manufacturers;
    this.statuses = response.statuses;
    this.appStatus = response.appStatus;
    this.appSubject = response.appSubject;
    this.items = response.feedbacks;
    this.paginationData = response.paginationData;

    if (this.activeFilter !== 'processId') {
      this.processes = this.setProcessSelect2Data(response['processes']);
      if (this.searchCriteria['processId']) {
        this.selectedValue = this.searchCriteria['processId'];
      }
    }


    if (this.selectedValue != "-1" && this.selectedValue != "0" && this.selectedValue && this.chips.length == 0)
      this.chips.push(this.processes.find(x => x.id == this.selectedValue));

    setTimeout(() => this.isLoadingData = false, 0);
  }
  remove(item) {
    this.RemoveParamsurl();
    this.searchCriteria['page'] = 1;
    this.chips.splice(item, 1);
    this.searchCriteria['processId'] = -1;
    this.search();
  }

  setSearch(name: 'processId', value: number): void {
    this.searchCriteria['page'] = 1;
    if (value !== 0) {
      this.activeFilter = name;

      if (this.isLoadingData) {
        return;
      }
      this.searchCriteria[name] = value;
      this.search();
    }
  }
  searchselect() {
    this.searchCriteria['page'] = 1;
    this.RemoveParamsurl();
    this.search();
  }
  Gettitle(item: FileFeedback) {
    return item.fileName;
  }
  openProductDetailsDialog(paymentID: FileFeedback): void {
    this.dialog.open(TransmissionProductDetailsFullComponent, {
     width: '800px',
      data: paymentID
    });
  }


  openDetailsDialog(Feedback: FileFeedbackError): void {

    let contacts1: Contact[];
    let application1: Application;
    let files1: { id: string, fileName: string }[];
    let searchCriteria = [];
    searchCriteria['OwnerID'] = Feedback.manufacturer.id;
    searchCriteria['distribution'] = 5;
    searchCriteria['OwnerType'] = 2;

    this.contactService.getContactsByOwner(searchCriteria)
      .then(response => {
        contacts1 = response;
      }).then(x => {
        this.generalService.getFilesByEmployer(Feedback.employer.id)
          .then(response => files1 = response).then(x => {
            this.generalService.getApplication(Feedback.applicationsId,false)
              .then(response => {
                console.log(response);
                application1 = response;
              }).then(x => {
         

                    
console.log("application1"+application1);
                const dialog = this.dialog.open(RepeatFeedbackFileApplicationComponent, {
                    width: '900px',
      data: {
                  applicationType: 2,
                  feedback: Feedback,
                  employerId: +this.searchCriteria['employerID'],
                  contacts: contacts1,
                  application: application1,
                  files: files1,
                 
                
      }
                });
              })



          })
      });


  }
  private setProcessSelect2Data(values: Object[]): Select2OptionData[] {

    const data = [
      { id: '0', text: 'בחר תהליך' },
      { id: '-1', text: 'הכל' }
    ];

    for (let i = 0; i < values.length; i++) {
      data[i + 2] = { id: values[i]['id'], text: values[i]['text'] };
    }

    return data;
  }

  handleEmployeeInfoClick(fileCodeId: number): void {
    const queryParams = {
      month: this.selectedMonthValue, year: this.selectedYearValue, fileCodeId: fileCodeId
      , employerId:
      this.searchCriteria['employerID']
    };

    this.router.navigate(['/feedback', 'table', 'employees'], <NavigationExtras>{ queryParams: queryParams });
  }

  newSearch(keyCode?: number): void {

    this.activeFilter = null;
    if (this.chips.length == 0)
      this.searchCriteria['processId'] = -1;
    super.search(keyCode);
  }

  openCommentDialog(feedback: FileFeedbackError,IsDisabled:boolean): void {
     
      const dialog = this.dialog.open(ApplicationCommentComponent,  {
      data:{
        Comments: feedback.Comments,
        IsDisabled:IsDisabled
     }
    });
  }

  selectAllMonths() {
    this.RemoveParamsurl();
    this.searchCriteria['months'] = [];
    this.selectedMonthValue = -1;
    for (let i = 1; i < 13; i++) {
      this.searchCriteria['months'].push(i);
    }

    this.fetchItems();
  }
}
