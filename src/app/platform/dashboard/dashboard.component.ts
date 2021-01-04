import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../shared/_services/http/general.service';
import { DatePipe } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { EstPaymentFormComponent} from './est-payment-form/est-payment-form.component';
import { NewEmployersFormComponent} from './new-employers-form/new-employers-form.component';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployersFormComponent } from './employers-form/employers-form.component';
import { Subscription } from 'rxjs/Subscription';
import { OtherPayerPopupComponent } from './other-payer-popup/other-payer-popup.component';
import { ChargedEmployersFormComponent } from './charged-employers-form/charged-employers-form.component';
import { ManuallyChargedEmployersComponent } from './manually-charged-employers/manually-charged-employers.component';
import { EmployersWithNoPaymentComponent } from './employers-with-no-payment/employers-with-no-payment.component';
import { EmployersPaymentZeroComponent } from './employers-payment-zero/employers-payment-zero.component';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { SelectUnitService } from '../../shared/_services/select-unit.service';
import { UserSessionService } from '../../shared/_services/http/user-session.service';
import { fade, slideInOut } from '../../shared/_animations/animation';
import { PRODUCT_TYPES_MYHR, PRODUCT_TYPES_SMARTI } from '../../shared/_models/employer-financial-details.model';
import { NeedToChargeEmployersComponent } from './need-to-charge-employers/need-to-charge-employers.component';
import { NotificationService } from '../../shared/_services/notification.service';
import { OrganizationService } from '../../shared/_services/http/organization.service';
import { EmployerService } from '../../shared/_services/http/employer.service';
import { PROJECT_GROUP } from '../../shared/_models/project.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [ fade , slideInOut ]

})
export class DashboardComponent implements OnInit {

  fromDateFormControl = new FormControl('', [
    Validators.required
  ]);
  toDateFormControl = new FormControl('', [
    Validators.required
  ]);
  projects = [];
  projectId: string;
  projectGroupId: any;
  organizations = [];
  organizationId: any;
  employers = [];
  employerId: any;
  timeRangeId: number;
  month: Date;
  currentMonth: Date;
  fromDate: Date;
  currentFromDate: Date;
  toDate: Date;
  currentToDate: Date;
  ifByMonth = true;
  monthStr: string;
  fromDateStr: string;
  toDateStr: string;
  sum_incomes: any;
  sum_invoices_system: any;
  sum_employers: any;
  data: any;
  d: any;
  newDate: Date;
  sub = new Subscription;
  productTypeId: string;
  currentProductTypeId: string;
  currentProjectId: string;
  currentProjectGroupId: string;
  currentOrganizationId: string;
  currentEmployerId: string;
  isPermissionsFinance = this.userSession.isPermissions('finance');
  productTypesItems = [];
  smarti: boolean;
  timeRange = [{id: 1, name: 'לפי חודש'}, {id: 2, name: 'לפי תקופה'}];
  days = {0: 'א', 1: 'ב',  2: 'ג',  3: 'ד', 4: 'ה', 5: 'ו', 6: 'ז' };
  projectGroups = [{id: 1, name: 'smarti'}, { id: 2, name: 'myHr'}];

  constructor(private GeneralService: GeneralService,
              private dialog: MatDialog,
              public datepipe: DatePipe,
              private router: Router,
              private route: ActivatedRoute,
              private helpers: HelpersService,
              private userSession: UserSessionService,
              private selectUnit: SelectUnitService,
              private NotificationService: NotificationService,
              private OrganizationService: OrganizationService,
              private EmployerService: EmployerService) {
  }

  ngOnInit() {
    this.selectUnit.setActiveUrl('dashboard');
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
      this.fetchItems();
    }));
    this.fetchItems();
  }

  fetchItems(): void {
    this.projectId = '0';
    this.projectGroupId = this.selectUnit.getProjectGroupId();
    this.currentProjectGroupId = this.selectUnit.getProjectGroupId();
    this.GeneralService.getProjects(this.projectGroupId)
        .then(response => {
          this.projects = response['data'];
          this.projects.push({'id': '0', 'name': 'כלל הפרויקטים'});
          this.projects.sort((a, b) => a.id - b.id);
          if (+this.selectUnit.getProjectGroupId() === 1) {
            this.productTypesItems = Object.keys(PRODUCT_TYPES_SMARTI).map(function (e) {
              return { id: e, name: PRODUCT_TYPES_SMARTI[e]};
            });
          }if (+this.selectUnit.getProjectGroupId() === 2) {
            this.productTypesItems = Object.keys(PRODUCT_TYPES_MYHR).map(function (e) {
              return { id: e, name: PRODUCT_TYPES_MYHR[e] };
            });
          }
          this.productTypesItems.push({'id': 'all', 'name': 'כלל המוצרים'});
          this.productTypesItems.sort((a, b) => a.id.localeCompare(b.id));
          this.productTypeId = 'all';
          this.month = new Date();
          this.timeRangeId = 1;
          this.filterData();
        });


  }

  loadOrganizationAndEmployers(): void {
    if (this.projectGroupId  && this.projectId !== '0') {
      this.OrganizationService.getOrganizationByProjectId(+this.projectId)
        .then(response => {
          console.log(response);
          this.organizations = response['data'];
          if (this.organizations.length > 0) {
            this.organizations.push({'id': '0', 'name': 'כלל הארגונים'});
            this.organizations.sort((a, b) => a.id - b.id);
            this.organizationId =  this.organizations ? this.organizations[0].id : 0;
          } else {
            this.organizations = [];
            this.organizationId = null;
            this.employers = [];
            this.employerId = null;
          }
        });
      this.EmployerService.getEmployersByProjectId(+this.projectId).then(res => {
        this.employers = res['data'];
        if (this.employers.length > 1) {
          this.employers.push({ id: '0', name: 'כלל המעסיקים' });
          this.employers.sort((a, b) => a.id - b.id);
          console.log(this.employers);
          this.employerId = this.employers[0].id;
          console.log(this.employerId);
        } else {
          this.employerId = this.employers[0] ? this.employers[0].id : 0;
        }
      });
    } else {
      this.OrganizationService.getOrganizationByProjectGroupId(this.selectUnit.getProjectGroupId())
        .then(response => {
          console.log(response);
          this.organizations = response['data'];
          if (this.organizations.length > 0) {
            this.organizations.push({'id': '0', 'name': 'כלל הארגונים'});
            this.organizations.sort((a, b) => a.id - b.id);
            this.organizationId =  this.organizations ? this.organizations[0].id : 0;
          } else {
            this.organizations = [];
            this.organizationId = null;
            this.employers = [];
            this.employerId = 0;
          }
        });
      // this.EmployerService.getEmployersByProjectGroupId(this.projectGroupId).then(res => {
      //   this.employers = res['data'];
      //   console.log(55);
      //   if (this.employers.length > 1) {
      //     this.employers.push({ id: '0', name: 'כלל המעסיקים' });
      //     this.employers.sort((a, b) => a.id - b.id);
      //     console.log(this.employers);
      //     this.employerId = this.employers[0].id;
      //     console.log(this.employerId);
      //   } else {
      //     this.employerId = this.employers[0] ? this.employers[0].id : 0;
      //   }
      // });
    }
  }

  loadEmployers(organizationId): void {
    if (this.organizationId !== '0') {
      this.EmployerService.getEmployersByOrganizationId(organizationId).then(res => {
        this.employers = res['data'];
        console.log(44);
        if (this.employers.length > 1) {
          this.employers.push({ id: '0', name: 'כלל המעסיקים' });
          this.employers.sort((a, b) => a.id - b.id);
          console.log(this.employers);
          this.employerId = this.employers[0].id;
          console.log(this.employerId);
        } else {
          this.employerId = this.employers[0] ? this.employers[0].id : 0;
        }
      });
    } else if (this.projectGroupId || this.projectId === '0') {
      this.EmployerService.getEmployersByProjectGroupId(this.projectGroupId).then(res => {
        this.employers = res['data'];
        console.log(55);
        if (this.employers.length > 1) {
          this.employers.push({ id: '0', name: 'כלל המעסיקים' });
          this.employers.sort((a, b) => a.id - b.id);
          console.log(this.employers);
          this.employerId = this.employers[0].id;
          console.log(this.employerId);
        } else {
          this.employerId = this.employers[0] ? this.employers[0].id : 0;
        }
      });
    } else {
      this.EmployerService.getEmployersByProjectId(+this.projectId).then(res => {
        this.employers = res['data'];
        console.log(22);
        if (this.employers.length > 1) {
          this.employers.push({ id: '0', name: 'כלל המעסיקים' });
          this.employers.sort((a, b) => a.id - b.id);
          console.log(this.employers);
          this.employerId = this.employers[0].id;
          console.log(this.employerId);
        } else {
          this.employerId = this.employers[0] ? this.employers[0].id : 0;
        }

      });
    }
  }

  changeTimeRange(): void {
    this.fromDate = null;
    this.toDate = null;
    this.fromDateFormControl = new FormControl('', [
      Validators.required
    ]);
    this.toDateFormControl = new FormControl('', [
      Validators.required
    ]);
    this.month = new Date();
  }

  filterData(): void {
    this.helpers.setPageSpinner(true);
    this.fetchData();
    if ((this.timeRangeId === 2 && this.fromDate && this.toDate) || (this.timeRangeId === 1 && this.month)) {
      // this.monthStr = this.datepipe.transform(this.month, 'yyyy-MM-dd');
      // this.fromDateStr = this.datepipe.transform(this.fromDate, 'yyyy-MM-dd');
      // this.toDateStr = this.datepipe.transform(this.toDate, 'yyyy-MM-dd');
      // if (this.timeRangeId === 2) {
      //   this.ifByMonth = false;
      // }
      this.GeneralService.get_financial_data(this.projectId, this.fromDateStr, this.toDateStr,
        this.productTypeId, this.organizationId, this.employerId)
        .then(response => {
          if (response['message'] === 'success') {
            console.log('sss ' + response['message']);
            this.data = response['data'];
            console.log(this.data);
            if (this.selectUnit.getProjectGroupId() === PROJECT_GROUP.SMARTI) {
              this.smarti = true;
            } else {
              this.smarti = false;
            }
            this.sum_invoices_system = this.data['invoice_system']['green_invoices']['sum'] +
              this.data['invoice_system']['green_invoices_error']['sum'];
            this.sum_incomes = this.data['incomes']['incomes_from_new_employers']['sum'] +
              this.data['incomes']['incomes_est_payment_amount']['sum'];
            this.sum_employers = this.data['employers_status']['charged_employers']['count']
              + this.data['employers_status']['need_to_charge_employers']['count']
              + this.data['employers_status']['charged_employers_manually']['count']
              + this.data['employers_status']['no_payment_detail_employers']['count']
              + this.data['employers_status']['employers_0_charge']['count'];
          } else {
            this.NotificationService.error('ארעה שגיאה');
          }
          this.helpers.setPageSpinner(false);
        });
    }
  }

  fetchData(): void {
    this.currentFromDate = this.fromDate;
    this.currentToDate = this.toDate;
    this.currentMonth = this.month;
    this.currentProductTypeId = this.productTypeId;
    this.currentProjectId = this.projectId;
    this.currentProjectGroupId = this.projectGroupId;
    this.currentOrganizationId = this.organizationId;
    this.currentEmployerId = this.employerId;
    this.fetchDates();
  }
  openInvoices(status: string): void {
      this.fetchDates();
      this.router.navigate(['../../platform/finance/invoices',
        {status: status, from_date: this.fromDateStr , to_date: this.toDateStr, project_id: this.currentProjectId,
          product_type: this.currentProductTypeId, organization_id: this.organizationId, employer_id: this.employerId }]);
  }

  openCalcProcesses(): void {
    this.fetchDates();
    this.router.navigate(['../../platform/finance/calc-processes',
        { from_date: this.fromDateStr , to_date: this.toDateStr}]);

  }

  fetchDates(): void {
    if (this.currentFromDate && this.currentToDate) {
      this.fromDateStr = this.datepipe.transform(this.currentFromDate, 'yyyy-MM-dd');
      this.toDateStr = this.datepipe.transform(this.currentToDate, 'yyyy-MM-dd');
    } else {
      this.toDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
      this.fromDateStr = this.datepipe.transform(new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1), 'yyyy-MM-dd');
      this.toDateStr = this.datepipe.transform(this.toDate, 'yyyy-MM-dd');
    }
  }
  openEstPaymentForm(): void {
    this.fetchDates();
    const dialog = this.dialog.open(EstPaymentFormComponent, {
      data: {
        'from_date':  this.fromDateStr,
        'to_date':  this.toDateStr,
        'project_id': this.currentProjectId,
        'product_type': this.currentProductTypeId,
        'organization_id': this.currentOrganizationId,
        'employer_id': this.currentEmployerId
      },
      width: '1000px',
      minHeight: '500px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
      this.router.navigate(['../../platform/dashboard']);
    }));
  }

  openNewEmployersForm(): void {
    this.fetchDates();
    const dialog = this.dialog.open(NewEmployersFormComponent, {
      data: {
        'from_date':  this.fromDateStr,
        'to_date':  this.toDateStr,
        'project_id': this.currentProjectId,
        'product_type': this.currentProductTypeId,
        'organization_id': this.currentOrganizationId,
        'employer_id': this.currentEmployerId
      },
      width: '1000px',
      minHeight: '500px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
      this.router.navigate(['../../platform/dashboard']);
    }));
  }

  getDayHe(date: string) {
    this.newDate = new Date(date);
    return this.days[this.newDate.getDay()];
  }

  openEmployersForm(payment_method: string): void {
    const dialog = this.dialog.open(EmployersFormComponent, {
      data: {
        'payment_method': payment_method,
        'project_id': this.currentProjectId,
        'product_type': this.currentProductTypeId,
        'organization_id': this.currentOrganizationId,
        'employer_id': this.currentEmployerId
      },
      width: '1000px',
      minHeight: '500px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
    if (result) {
      this.selectUnit.setActiveUrl('employers');
      this.selectUnit.setEmployerRelation(result);
      this.router.navigate(['../../platform/employers/form/' + result]);
    } else {
      this.router.navigate(['../../platform/dashboard']);
    }
    }));
  }

  openChargedEmployerPopUp(): void {
    this.fetchDates();
    const dialog = this.dialog.open(ChargedEmployersFormComponent, {
      data: {
        'from_date':  this.fromDateStr,
        'to_date':  this.toDateStr,
        'project_id': this.currentProjectId,
        'product_type': this.currentProductTypeId,
        'organization_id': this.currentOrganizationId,
        'employer_id': this.currentEmployerId
      },
      width: '1000px',
      minHeight: '500px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
        this.router.navigate(['../../platform/dashboard']);
    }));
  }

  openManuallyChargedPopUp(): void {
    this.fetchDates();
    const dialog = this.dialog.open(ManuallyChargedEmployersComponent, {
      data: {
        'from_date':  this.fromDateStr,
        'to_date':  this.toDateStr,
        'project_id': this.currentProjectId,
        'product_type': this.currentProductTypeId,
        'organization_id': this.currentOrganizationId,
        'employer_id': this.currentEmployerId
      },
      width: '1000px',
      minHeight: '500px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
      this.router.navigate(['../../platform/dashboard']);
    }));
  }

  openNeedToChargeEmployersPopUp(): void {
    this.fetchDates();
    const dialog = this.dialog.open(NeedToChargeEmployersComponent, {
      data: {
        'from_date':  this.fromDateStr,
        'to_date':  this.toDateStr,
        'project_id': this.currentProjectId,
        'product_type': this.currentProductTypeId,
        'organization_id': this.currentOrganizationId,
        'employer_id': this.currentEmployerId
      },
      width: '1000px',
      minHeight: '500px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
      this.router.navigate(['../../platform/dashboard']);
    }));
  }

  openEmployersWithNoPaymentPopUp(): void {
    this.fetchDates();
    const dialog = this.dialog.open(EmployersWithNoPaymentComponent, {
      data: {
        'from_date': this.fromDateStr,
        'to_date': this.toDateStr,
        'project_id': this.currentProjectId,
        'product_type': this.currentProductTypeId,
        'organization_id': this.currentOrganizationId,
        'employer_id': this.currentEmployerId
      },
      width: '1000px',
      minHeight: '500px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
      this.router.navigate(['../../platform/dashboard']);
    }));
  }

  openEmployersPaymentZeroPopUp(): void {
    this.fetchDates();
    const dialog = this.dialog.open(EmployersPaymentZeroComponent, {
      data: {
        'from_date':  this.fromDateStr,
        'to_date':  this.toDateStr,
        'project_id': this.currentProjectId,
        'product_type': this.currentProductTypeId,
        'organization_id': this.currentOrganizationId,
        'employer_id': this.currentEmployerId
      },
      width: '1000px',
      minHeight: '500px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
      this.router.navigate(['../../platform/dashboard']);
    }));
  }

  showInvoices(): void {
    this.router.navigate(['../../platform/finance/invoices']);
  }

  openOtherPayerPopup(): void {
    this.fetchDates();
    const dialog = this.dialog.open(OtherPayerPopupComponent, {
      data: {
        'from_date':  this.fromDateStr,
        'to_date':  this.toDateStr,
        'project_id': this.currentProjectId,
        'product_type': this.currentProductTypeId,
        'organization_id': this.currentOrganizationId,
        'employer_id': this.currentEmployerId
      },
      width: '1000px',
      minHeight: '500px'
    });
    this.sub.add(dialog.afterClosed().subscribe(result => {
      this.router.navigate(['../../platform/dashboard']);
    }));
  }
}
