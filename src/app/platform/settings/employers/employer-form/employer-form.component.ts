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
  entityRows = [{}];

  banks = [];

  bankAccounts = [];


  constructor(private route: ActivatedRoute, private router: Router, private employerService: EmployerService) {}

  ngOnInit() {
    this.loadBanks();
    if (this.route.snapshot.data.employer) {
      this.employer = this.route.snapshot.data.employer;
      this.bankAccounts = this.employer.bank_accounts;

      // for (const item in this.bankAccounts) {
      //   if (this.bankAccounts[item] !== null) {
      //     this.bankBranches.push({ bank_id: this.bankAccounts[item].bank_id, branch_id: this.bankAccounts[item].branch_id });
      //   }
      // }
      }

  }
  loadBanks(): void {

    this.employerService.getBanks(true).then(types => {this.banks = types; });
  }

  // loadBankBranches(bank: Bank): void {
  //   this.bankBranches = [];
  //   this.employerService.getBankBranches(bank.id).then(types => {this.bankBranches = types; });
  // }

  getBanksWithBranches(): void {
    this.employerService.getBanksWithBranches().then(banks => this.banks = banks );
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

  addEntityRow(): void {
    this.entityRows.push({});
  }

  deleteEntityRow(index: number): void {
    this.entityRows.splice(index, 1);
  }

}
