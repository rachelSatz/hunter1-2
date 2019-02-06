import { Component, OnInit } from '@angular/core';
import {EmployerService} from '../../../../../shared/_services/http/employer.service';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css']
})
export class FinanceComponent implements OnInit {
  comments;
  constructor(private employerService: EmployerService) { }

  ngOnInit() {
    // employerId
    this.employerService.getEmployerFinance(1).then(response => this.comments = response);
  }

}
