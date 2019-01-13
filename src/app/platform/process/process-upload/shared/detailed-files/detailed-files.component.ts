import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { AttachReferenceComponent } from './attach-reference/attach-reference.component';
import { UpdatePaymentTypeComponent } from './update-payment-type/update-payment-type.component';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { ProcessService } from 'app/shared/_services/http/process.service';
import {PaymentType, FilesStatus, EmployerProduct} from 'app/shared/_models/process.model';
import { UpdateAccountNumberComponent } from './update-account-number/update-account-number.component';
import { UpdatePaymentDateComponent } from './update-payment-date/update-payment-date.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { CommentsComponent } from './comments/comments.component';

@Component({
  selector: 'app-detailed-files',
  templateUrl: './detailed-files.component.html',
  styleUrls: ['../../../../../shared/data-table/data-table.component.css']
})
export class DetailedFilesComponent extends DataTableComponent implements OnInit, OnDestroy {

  readonly headers: DataTableHeader[] =  [
    { column: 'group_id', label: 'מס קבוצה' }, { column: 'company', label: 'חברה מנהלת' },
    { column: 'product_pay', label: 'קופה בשכר' }, { column: 'product_type', label: 'סוג מוצר' },
    { column: 'product', label: 'מ"ה' }, { column: 'type_pay', label: 'סוג תשלום' },
    { column: 'payment_identifier', label: 'מס אסמכתא' },
    { column: 'account', label: 'מס חשבון/צק' }, { column: 'date_pay', label: 'תאריך תשלום' },
    { column: 'amount', label: 'סכום' }, { column: 'number', label: 'מספר מזהה' },
    { column: 'comment', label: 'הערות' }, { column: 'status', label: 'סטטוס' },
    { column: 'file', label: 'אסמכתא' }
  ];

  constructor(route: ActivatedRoute,
              private dialog: MatDialog,
              private  processService: ProcessService,
              protected  notificationService: NotificationService) {
    super(route, notificationService);
  }

  paymentType = PaymentType;
  filesStatus = FilesStatus;

  ngOnInit() {
    this.fetchItems();
    super.ngOnInit();
  }

  fetchItems() {
    this.processService.getFilesList(1).then( response => this.setItems(response));
  }



  openDialogAttachReference(): void {
    if (this.checkedRowItems()) {
      this.dialog.open(AttachReferenceComponent, {
        width: '550px',
        panelClass: 'send-email-dialog'
      });
    }
  }

  checkedRowItems(): boolean {
    if (this.checkedItems.length === 0) {
      this.setNoneCheckedWarning();
      return false;
    }
    return true;
  }

   openUpdateTypePayDialog(typePay: string, file_id: number): void {

     this.dialog.open(UpdatePaymentTypeComponent, {
       data: {'typePay': typePay, 'file_id': [file_id]},
       width: '550px',
       panelClass: 'dialog-file'
     });
   }

   openUpdateAccountNumberDialog(accNum: string, file_id: number): void {
     this.dialog.open(UpdateAccountNumberComponent, {
       data: {'accNum': accNum, 'file_id': [ file_id ]},
       width: '655px',
       panelClass: 'dialog-file'
     });
   }

   openUpdatePayDateDialog(date: string, file_id: number): void {
     if (file_id !== -1 || this.checkedRowItems()) {
       this.dialog.open(UpdatePaymentDateComponent, {
         data: {'date': date, 'file_id': file_id === -1 ? this.checkedItems.map(item => item.file_id) : [ file_id ]},
         width: '550px',
         panelClass: 'dialog-file'
       });
     }
   }

  openCommentsDialog(file_id: number): void {
    this.dialog.open(CommentsComponent, {
      data: {'file_id': [ file_id ]},
      width: '655px',
      panelClass: 'dialog-file'
    });
  }

  openWarningMessageComponentDialog(type: string): void {
    const title = type ? 'לא רלונטי' : 'מחיקת שורות';
    const body = type ? 'האם ברצונך להפוך שורת אלו ללא רלונטית?' : 'האם ברצונך למחוק שורת אלו?';
    const typeData = type ? 'notRelevant' : 'delete';
    if (this.checkedRowItems()) {

      const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};

      this.notificationService.warning( title, body, buttons).then(confirmation => {
        if (confirmation.value) {
          this.processService.update( typeData, '' , this.checkedItems.map(item => item.file_id))
            .then( response => {
              if (response) {
                this.checkedItems = [];
                this.isCheckAll = false;
                this.fetchItems();
              } else {
                this.notificationService.error( '', 'הפעולה נכשלה');
              }
            });
        }
      });
    }
  }
  getTitle(employer_products: EmployerProduct[]): string[] {
    const title = [];
    if (employer_products.length > 1) {
      title[0] = employer_products[0].code + ' - ' + employer_products[0].name;
      title[1] = employer_products[1].code + ' - ' + employer_products[1].name;
    } else {
      title[0] = employer_products[0].code + ' - ' + employer_products[0].name;
    }

    return title;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
