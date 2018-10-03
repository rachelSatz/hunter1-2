import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { GeneralHttpService } from '../../../../shared/_services/http/general-http.service';
import { EmployerService } from '../../../../shared/_services/http/employer.service';
import { Employer } from '../../../../shared/_models/employer.model';
import {NotificationService, NotificationType} from '../../../../shared/_services/notification.service';
import { Select2OptionData } from 'ng2-select2';

@Component({
  selector: 'app-employer-form',
  templateUrl: './employer-form.component.html',
  styleUrls: ['./employer-form.component.css']
})
export class EmployerFormComponent implements OnInit, OnDestroy {

  paramSubscription: Subscription;

  employer = new Employer();

  isSubmitting: boolean;
  isSuccessful: boolean;

  employerIdUpdateMode = -1;

  typeSentOptions: {Key: string , Value: number}[];

  select2Options: Select2Options;
  bankBranches: Select2OptionData[] = [];
  bankBranchSelected = '-1';

  banks: Select2OptionData[] = [];
  bankSelected = '-1';

  constructor(private router: Router, private route: ActivatedRoute, private generalHttp: GeneralHttpService,
              private employerService: EmployerService, private notificationService: NotificationService) {}

  ngOnInit() {

    this.generalHttp.getBanks().then(response => {
      this.banks = response.map( x => <Select2OptionData>{id: String(x.id), text : String(x.id)+' - '+x.text});
      this.banks.unshift({id: '-1', text : 'בחר בנק'});
      this.bankSelected = '-1';
    });

    this.generalHttp.getEmployerTypeSentEnum()
    .then(response => this.typeSentOptions = response);

     this.paramSubscription = this.route.params.subscribe(message => {
        if (message['id']) {
          this.employerIdUpdateMode = +message['id'];
          this.employerService.getEmployer(+message['id']).then(response => {
         
            this.employer = response;
           
             if(this.employer.instituteCode5=="0"){
               this.employer.instituteCode5=null;
             }
            if(this.employer.instituteCode8=="0"){
              this.employer.instituteCode8=null;
            }
            if (this.employer.bankBranch.bank.id !== 0) {
              this.bankSelected =  String(this.employer.bankBranch.bank.id);
              this.loadBankBranches(this.employer.bankBranch.bank.id);
            }
          });
        } else {
          this.employerIdUpdateMode = -1;
          this.clearBankBranch();
        }
     });
  }

  loadBankBranches(bankID: number): void {
    if (bankID) {
      this.generalHttp.getBankBranches(bankID).then(response => {
      this.bankBranches = response.map( x => <Select2OptionData>{id: String(x.id), text : String(x.id)+' - '+x.text});
      this.bankBranches.unshift({id: '-1', text : 'בחר סניף'});

      if (this.employer.bankBranch.id !== 0) {
        this.bankBranchSelected = String(this.employer.bankBranch.id);
      }
      });
    }
  }

  submit(isValid: boolean): void {
  debugger;
    if (isValid) {
      if ( this.employerIdUpdateMode === -1) {
      this.isSubmitting = true;
      this.employerService.newEmployer(this.employer).then(
        response => setTimeout(() => this.handleResponse(response), 2000)
      );
      } else {
        this.isSubmitting = true;
        this.employerService.updateEmployer(this.employer, this.employerIdUpdateMode)
        .then(response => setTimeout(() => {
          this.notificationService.showResult(response ?
            'עדכון הרשומה בוצע בהצלחה' : 'עדכון הרשומה נכשל', response ? NotificationType.success : NotificationType.error);
            sessionStorage.removeItem('employers');
          this.router.navigate(['/settings/employers']);
        }, 2000));
      }
    }
  }

  private handleResponse(response: Employer): void {

    if (response['id']) {
      sessionStorage.setItem('new-employer', JSON.stringify(response));
      this.router.navigate(['/settings', 'employers']);
    }

    this.isSuccessful = false;
    this.isSubmitting = false;
  }

  setBankBranch(index: string): void {
    this.employer.bankBranch.text = '';
    if(index === '-1') {
      this.employer.bankBranch.id = 0;

    } else {
      this.employer.bankBranch.id = Number(index);
    }
  }

  setBank(index: string): void {
    this.employer.bankBranch.bank.text = '';

    if(index === '-1') {
      this.employer.bankBranch.bank.id = 0;
      this.employer.bankBranch.id = 0;
      this.clearBankBranch();
    } else {
      this.employer.bankBranch.bank.id = Number(index);
      this.loadBankBranches(Number(index));
    }
  }

  clearBankBranch(): void {
    this.bankBranches = [];
    this.bankBranches.push({id: '-1', text : 'בחר סניף'});
    this.bankBranchSelected = '-1';
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
  }
}
