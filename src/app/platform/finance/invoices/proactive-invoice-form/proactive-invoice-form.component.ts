import { ActivatedRoute, Router } from '@angular/router';
import { Component , OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { InvoiceService } from 'app/shared/_services/http/invoice.service';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-proactive-invoice-form',
  templateUrl: './proactive-invoice-form.component.html',
  styles: ['#styleFormat { height: 200px; padding-top: 20px }'],
  animations: [ fade ]
})
export class ProactiveInvoiceFormComponent implements OnInit {
  employers = [];
  message: string;
  invoice = [];

  constructor(private route: ActivatedRoute, private router: Router, private invoiceService: InvoiceService,
              private employerService: EmployerService,  private selectUnit: SelectUnitService) { }

  ngOnInit() {
    this.employerService.getEmployers(this.selectUnit.currentOrganizationID).then(response => this.employers = response);

  }
  submit(form: NgForm): void {
      this.invoiceService.createInvoice(form.value).then(response => {
        this.invoice = response; });
  }
}
