import {Component, Inject, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { animate, state, style, transition, trigger } from '@angular/animations';
import {EmployerService} from '../../../../shared/_services/http/employer.service';
import {SelectUnitService} from '../../../../shared/_services/select-unit.service';
import {InvoiceService} from '../../../../shared/_services/http/invoice.service';
import {stringDistance} from 'codelyzer/util/utils';

@Component({
  selector: 'app-proactive-invoice-form',
  templateUrl: './proactive-invoice-form.component.html',
  styles: ['#styleFormat { height: 200px; padding-top: 20px }'],
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: '0'
      })),
      state('active', style({
        display: '*',
        opacity: '1'
      })),
      transition('active => inactive', animate('0ms')),
      transition('inactive => active', animate('200ms'))
    ])
  ]
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
