import {ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
import { EmployerFinancialDetails } from '../../../shared/_models/employer-financial-details.model';
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
  status: object;
  saveChanges = false;
  activeUrl: string;
  editClose = true;
  types = TYPES;
  financialDetails: EmployerFinancialDetails;
  sub = new Subscription;
  permissionsType = this.userSession.getPermissionsType('employers');
  statuses = Object.keys(EmployerStatus).map(function(e) {
    return { id: e, name: EmployerStatus[e] };
  });
  headers = [
    {label: 'פירוט הסכם', url: 'finance' , subUrl: 'no_permissions' },
    {label: 'חשבוניות',   url: 'documents' , subUrl: 'no_permissions' },
    {label: 'אנשי קשר',   url: 'contacts' , subUrl: 'no_permissions' },
    {label: 'הערות', url: 'remarks'  , subUrl: 'no_permissions' },
  ];

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
              private ref: ChangeDetectorRef,
              private userSession: UserSessionService) { }

  ngOnInit() {
    this.helpers.setPageSpinner(true);
    if (this.route.snapshot.data.employer) {
       this.employer = this.route.snapshot.data.employer;
     }
     this.setStatus();
     this.initForm();
     this.activeUrl = 'finance';
     this.sub.add(this.selectUnit.unitSubject.subscribe(() => {
       if (this.selectUnit.currentEmployerRelationID !==  this.employer.id) {
         this.helpers.setPageSpinner(false);
         this.router.navigate(['platform', 'employers']);
       }
     }));
  }

  initForm(): void {
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
