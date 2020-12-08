import { Component, OnDestroy, OnInit } from '@angular/core';
import { fade, rotate, slideToggle } from '../../../shared/_animations/animation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employer, EmployerStatus } from '../../../shared/_models/employer.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectUnitService } from '../../../shared/_services/select-unit.service';
import { EmployersResolve } from '../../../shared/_resolves/employers.resolve';
import { NotificationService } from '../../../shared/_services/notification.service';
import { EmployerService } from '../../../shared/_services/http/employer.service';
import { Location } from '@angular/common';
import { CURRENCY, EmployerFinancialDetails, LANGUAGE, PAYMENT_TIME } from '../../../shared/_models/employer-financial-details.model';
import { TYPES } from '../../../shared/_models/invoice.model';
import { PlatformComponent } from '../../platform.component';
import { HelpersService } from '../../../shared/_services/helpers.service';
import { UserSessionService } from '../../../shared/_services/http/user-session.service';

@Component({
  selector: 'app-employer-form',
  templateUrl: './employer-form.component.html',
  styleUrls: ['./employer-form.component.css'],
  animations: [ fade, rotate, slideToggle ]
})
export class EmployerFormComponent implements OnInit, OnDestroy {

  employerForm: FormGroup;
  employer: Employer = new Employer();
  projects = [];
  project = {id: 0, name: ''};
  status: object;
  saveChanges = false;
  activeUrl: string;
  editClose = true;
  types = TYPES;
  showDetails = 'inactive';
  formDetails = false;
  financialDetails: EmployerFinancialDetails;
  sub = new Subscription;
  flag: boolean;
  permissionsType = this.userSession.getPermissionsType('employers');
  currencyItems = Object.keys(CURRENCY).map(function(e) {
    return { id: e, name: CURRENCY[e] };
  });
  languageItems = Object.keys(LANGUAGE).map(function(e) {
    return { id: e, name: LANGUAGE[e] };
  });
  paymentTimeItems = Object.keys(PAYMENT_TIME).map(function(e) {
    return { id: e, name: PAYMENT_TIME[e] };
  });
  headers = [
    {label: 'פירוט הסכם', url: 'finance' , subUrl: 'no_permissions' },
    {label: 'חשבוניות',   url: 'documents' , subUrl: 'no_permissions' },
    {label: 'אנשי קשר',   url: 'contacts' , subUrl: 'no_permissions' },
    {label: 'הערות', url: 'remarks'  , subUrl: 'no_permissions' },
  ];
  statuses = Object.keys(EmployerStatus).map(function(e) {
    return { id: e, name: EmployerStatus[e] };
  });

  constructor(private router: Router,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              public selectUnit: SelectUnitService,
              private employersResolve: EmployersResolve,
              private notificationService: NotificationService,
              private employerService: EmployerService,
              private _location: Location,
              private EmployerService: EmployerService,
              private PlatformComponent: PlatformComponent,
              private helpers: HelpersService,
              private userSession: UserSessionService) { }

  ngOnInit() {
    this.helpers.setPageSpinner(true);
    if (this.route.snapshot.data.employer) {
       this.employer = this.route.snapshot.data.employer;
       this.selectUnit.setOrganizationID(this.employer['org_id']);
       this.selectUnit.setEmployerID(this.route.snapshot.params.id);
     }
     if (!this.selectUnit.getActiveEmployerUrl()) {
       this.selectUnit.setActiveEmployerUrl('finance');
     }
    this.setStatus();
    this.initForm();
    this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
        // this.initForm();
      // this.router.navigate(['platform', 'employers']);

      }
    ));
    this.flag = true;
  }


  initForm(): void {
    this.EmployerService.getEmployer(this.selectUnit.getEmployerID()).then(response => {
      this.employer = response;
      this.EmployerService.getEmployerFinance(this.employer['id_emp'])
        .then(res => {
          this.financialDetails = res;
        });
    })
    this.employerForm = this.fb.group({
      'name': [null , Validators.required],
      'identifier': [null , [Validators.pattern('^\\d{9}$'), Validators.required]]
    });
    this.helpers.setPageSpinner(false);
  }
  setStatus() {
    for (let i = 0; i < this.statuses.length; i++) {
      if (this.statuses[i].id === this.employer.status) {
        this.status = this.statuses[i];
      }
    }
  }
  setActiveUrl(url: string): void {
    this.activeUrl = url;
  }
  previous(): void {
    this._location.back();
  }
  showEmployerFinanceDetails(): void{
    this.formDetails = !this.formDetails;
    this.showDetails = (this.showDetails === 'active') ? 'inactive' : 'active';
  }
  getCurrency(currency: any) {
    return this.currencyItems.find(x => x.id === currency).name;
  }
  getLanguage(language: any) {
    return this.languageItems.find(x => x.id === language).name;
  }
  getPaymentTime(paymentTime: any) {
    return this.paymentTimeItems.find(x => x.id === paymentTime).name;
  }
  openOrCloseEditEmployerDetails(): void {
    if (this.editClose) {
      this.editClose = false;
    } else {
      this.editClose = true;
    }
  }
  ngOnDestroy(): void {

  }
}
