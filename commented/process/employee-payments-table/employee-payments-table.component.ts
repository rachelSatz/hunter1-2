import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { EmployeePaymentFormComponent } from '../employee-payment-form/employee-payment-form.component';

import { ProcessService } from '../../../shared/_services/http/process.service';
import {NotificationService, NotificationType} from '../../../shared/_services/notification.service';
import { ManualProcessService } from '../../../shared/_services/http/manual-process.service';

import { Employer} from '../../../shared/_models/employer.model';
import { Process } from '../../../shared/_models/process.model';
import { productTypeLabel, SugTakbulLabel, WorksInSalaryLabel } from '../../../shared/_const/EnumLabels';

import { MONTHS } from '../../../shared/_const/months';

@Component({
  selector: 'app-employee-payments-table',
  templateUrl: './employee-payments-table.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class EmployeePaymentsTableComponent extends DataTableComponent implements OnInit {

  @Input() employer: Employer;
  @Input() process: Process;

  manualProcessCreated = false;
  readonly months = MONTHS;

  constructor(protected route: ActivatedRoute, private dialog: MatDialog, private manualProcessService: ManualProcessService,
              private processService: ProcessService, private notificationService: NotificationService) {
    super(route);
  }

  ngOnInit() {
      super.ngOnInit();
  }

  fetchItems(): void {
      this.manualProcessService.getPreHafrashot(this.process).then(response => this.setItems(response));
  }

  setItems(response: any): void {
    this.items = response;
  }

  makeNewPayment(): void {
    const dialogRef = this.dialog.open(EmployeePaymentFormComponent, {
      width: '700px',
      disableClose: true,
      data: {
        process: this.process// this.employer
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'cancel') {
        this.notificationService.showResult(result, NotificationType.error);
        this.fetchItems();
      }
    });
  }

  createNewProcess(): void {
    this.manualProcessService.newManualProcess(this.process).then(response => {
      this.process = response;
      this.manualProcessCreated = true;
    });
  }

  convertToDate(date: string): Date {
    return new Date(date);
  }

  getMonthLabel(date: string): string {
    const d: Date = new Date(date);
    return this.months[d.getMonth()];
  }

  getSugTakbulLabel(key: number): string{
    return SugTakbulLabel.get(key);
  }

  getWorksInSalary(key: number): string {
    return WorksInSalaryLabel.get(key);
  }
  getProductTypeLabel(key: number): string {
    return productTypeLabel.get(key);
  }
}
