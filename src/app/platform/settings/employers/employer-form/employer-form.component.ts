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
  hasServerError: boolean;

  employer = new Employer();
  bankBranches = [];

  bankSelected = -1;
  banks = [];

  constructor(private route: ActivatedRoute, private router: Router, private employerService: EmployerService) {}

  ngOnInit() {
    this.loadBanks();
    if (this.route.snapshot.data.employer) {
      this.employer = this.route.snapshot.data.employer;
      // this.employer['bank_id'] = 4;
      // if (this.employer.bankBranch.bank.id !== 0) {
      //   this.bankSelected =  this.employer.bankBranch.bank.id;
      //   this.loadBankBranches(this.employer.bankBranch.bank);
      //   }
      }

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
    this.bankBranches = [];
    this.employerService.getBankBranches(bank.id).then(types => {
      for (const i in types) {
        if (types[i] !== null) {
          this.bankBranches.push({ id: types[i].id, name: types[i].name });
        }
      }
    });
  }

  submit(form: NgForm): void {
    this.hasServerError = false;

    if (form.valid) {
      if (this.employer.id) {
        this.employerService.updateEmployer(form.value, this.employer.id).then(response => this.handleResponse(response));
      } else {
        this.employerService.saveNewEmployer(form.value).then(response => this.handleResponse(response));
      }
    }
  }

  private handleResponse(isSaved: boolean): void {
    if (isSaved) {
      this.router.navigate(['platform', 'settings', 'employers']);
    } else {
      this.hasServerError = true;
    }
  }
  // if (this.employer.bankBranch.id !== 0) {
  // this.bankBranchSelected = String(this.employer.bankBranch.id);
  // }

}
