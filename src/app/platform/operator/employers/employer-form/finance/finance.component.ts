import { Component, OnInit } from '@angular/core';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import {EmployerFinancialDetails} from '../../../../../shared/_models/employer-financial-details.model';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css']
})
export class FinanceComponent implements OnInit {
  financialDetails: EmployerFinancialDetails;
  hasServerError: boolean;

  constructor(private employerService: EmployerService) { }

  ngOnInit() {
    // employerId
    this.employerService.getEmployerFinance(5).then(response =>
      this.financialDetails = response);
  }

  submit(form: NgForm): void {
    this.hasServerError = false;
    if (form.valid) {
      if (this.financialDetails.id) {
        this.employerService.updateFinancialDetails(this.financialDetails.id, this.financialDetails)
          .then(response => response);
      } else {
        this.employerService.saveFinancialDetails(this.financialDetails)
          .then(response => response);
      }
    }
  }


}


