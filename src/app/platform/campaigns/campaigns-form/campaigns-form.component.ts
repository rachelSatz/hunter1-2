import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-campaigns-form',
  templateUrl: './campaigns-form.component.html',
  styleUrls: ['./campaigns-form.component.css']
})
export class CampaignsFormComponent implements OnInit {
  sub = new Subscription;
  tab: number;

  request = { submitFailed: false, submitSuccessfully: false };

  createdAt: string;

  hasActionPermission: boolean;

  // campaignForm = this.fb.group({
  //   'typeSubForm' : this.fb.group ({
  //     'name': 				[null, Validators.required, [this.checkNameExists.bind(this)]],
  //     'module': 			[null, Validators.required],
  //     'form': 				[null, Validators.required],
  //     'moduleStatuses': [null, Validators.required],
  //     'method': 			[null, Validators.required],
  //     'sendAt':  			[0, Validators.required],
  //     'repeatEvery': 	[{ value: null, disabled: true }],
  //   }),
  //   'groupSubForm' : this.fb.group ({
  //     'groups': [null],
  //     'isBackup': [false, Validators.required],
  //     'isCheckAll' : [false]
  //   }),
  // });

  constructor(

  ) { }

  ngOnInit() {
    if (!this.tab) {
      this.tab = 1;
    }
    // this.hasActionPermission = this.userSession.hasResourcePermission('campaigns', 'actions');
    // if (!this.hasActionPermission) {
    //   this.router.navigate(['employer', 'campaigns', 'list']);
    // }

  }

  submit(isValid: boolean) {
    // const controls = this.campaignForm.get('typeSubForm')['controls'];
    // for (const control in controls) {
    //   if (controls.hasOwnProperty(control)) {
    //     controls[control].markAsTouched();
    //   }
    // }
    //
    // if (isValid) {
    //   this.helpers.setPageSpinner(true);
    //   this.campaignService.create(this.selectEmployerService.getEmployerId(), this.campaignForm.value)
    //     .then(response => {
    //       this.helpers.setPageSpinner(false);
    //       this.handleResponse(response);
    //     });
    // }
  }

  back() {
    if (this.tab !== 1) {
      this.tab -= 1;
    }
  }

  continue() {
    this.tab += 1;
  }

  private handleResponse(response: {message: 'success'|'bad request'|'error', createdAt?: string, code: number}): void {
    // if (response) {
    //   if (response.message === 'error') {
    //     switch (response.code) {
    //       case 1:
    //         this.notificationService.error('לא ניתן ליצור קמפיין זה', 'כל העובדים כבר בחרו במוצר זה');
    //         break;
    //     }
    //   }
    //
    //   if (response.message === 'success') {
    //
    //     this.createdAt = response['createdAt'];
    //     this.request.submitSuccessfully = true;
    //     this.request.submitFailed = false;
    //
    //     this.notificationService.success('הקמפיין נשלח בהצלחה');
    //     this.router.navigate(['/employer/campaigns/list']);
    //   }
    //
    //   if (response.message === 'bad request') {
    //     this.request.submitSuccessfully = false;
    //     this.request.submitFailed = true;
    //   }
    // }
  }


  private checkNameExists(name: FormControl) {
    // return this.campaignService.checkNameExists(this.selectEmployerService.getEmployerId(), name.value)
    //   .then(response => !response.exists ? null : {exists: true}
    //   );
  }

}
