import {Component, Inject, OnInit} from '@angular/core';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {Employer} from '../../../../shared/_models/employer.model';
import {Bank} from '../../../../shared/_models/bank.model';
import {BankBranch} from '../../../../shared/_models/bank-branch.model';
import {NgForm} from '@angular/forms';



@Component({
  selector: 'app-employer-form',
  templateUrl: './employer-form.component.html',
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        height: '0'
      })),
      state('active', style({
        display: '*',
        height: '*'
      })),
      transition('active => inactive', animate('200ms')),
      transition('inactive => active', animate('200ms'))
    ])
  ]
})
export class EmployerFormComponent implements OnInit {

  isSubmitting: boolean;
  isSuccessful: boolean;

  employerIdUpdateMode = -1;
  employer = new Employer();
  typeSentOptions: {Key: string , Value: number}[];

  bankBranches = [];
  bankBranchSelected = '-1';

  banks = [];
  bankSelected = '-1';

  constructor(private route: ActivatedRoute, private router: Router, private employerService: EmployerService) {}

  ngOnInit() {
    // if (this.route.snapshot.data.employer) {
    //   this.employer = this.route.snapshot.data.employer;
    // }
    this.loadBanks();
  }
  loadBanks(): void {
    this.employerService.getBanks().then(types => {
      for (const i in types) {
        if (types[i] !== null) {
          this.banks.push({id: types[i].id, name: types[i].name});
        }
      }
    });
  }

  loadBankBranches(bank: Bank): void {
    this.employerService.getBankBranches(bank.id).then(types => {
      for (const i in types) {
        if (types[i] !== null) {
          this.bankBranches.push({ id: types[i].id, name: types[i].name });
        }
      }
    });
  }

  submit(form: NgForm): void {
    // this.hasServerError = false;
    //
    // if (form.valid) {
    //   if (this.employer.id) {
    //     this.employerService.updateContact(form.value, this.contact.id).then(response => this.handleResponse(response));
    //   } else {
    //     this.employerService.newContact(form.value).then(response => this.handleResponse(response));
    //   }
    // }
  }

  // if (this.employer.bankBranch.id !== 0) {
  // this.bankBranchSelected = String(this.employer.bankBranch.id);
  // }

}
