import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { PaymentType, FilesStatus, EmployerProduct } from 'app/shared/_models/process.model';
import { NotificationService } from 'app/shared/_services/notification.service';

import { AttachReferenceComponent } from './attach-reference/attach-reference.component';
import { UpdatePaymentTypeComponent } from './update-payment-type/update-payment-type.component';
import { UpdateAccountNumberComponent } from './update-account-number/update-account-number.component';
import { UpdatePaymentDateComponent } from './update-payment-date/update-payment-date.component';
import { CommentsComponent } from './comments/comments.component';

import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { ProductType } from 'app/shared/_models/product.model';
import { Status } from 'app/shared/_models/file-feedback.model';
import {HelpersService} from '../../../../../shared/_services/helpers.service';

@Component({
  selector: 'app-detailed-files',
  templateUrl: './detailed-files.component.html',
  styleUrls: ['../../../../../shared/data-table/data-table.component.css', './detailed-files.component.css']
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
    { column: 'file', label: 'אסמכתא' }, { column: 'broadcast_lock', label: 'נעילת שידור' }
  ];

  constructor(protected route: ActivatedRoute,
              private dialog: MatDialog,
              private  processService: ProcessService,
              private processDataService: ProcessDataService,
              protected  notificationService: NotificationService,
              private helpers: HelpersService ) {
  super(route , notificationService);
  }

  paymentType = PaymentType;
  productType = ProductType;
  spin: boolean;
  sub = new Subscription;
  statuses = Status;

  ngOnInit() {
    super.ngOnInit();
  }

  fetchItems () {
    this.helpers.setPageSpinner(true);
    this.processService.getFilesList(this.processDataService.activeProcess.processID)
      .then( response => {
        this.helpers.setPageSpinner(false);
        this.setItems(response);
      });
  }


  openDialogAttachReference(): void {
    if (this.checkedRowItems()) {
      if (this.isLockedBroadcast()) {
      const dialog = this.dialog.open(AttachReferenceComponent, {
        data: {'file_id': this.checkedItems.map(item => item.file_id)},
        width: '550px',
        panelClass: 'send-email-dialog'
      });

      this.sub.add(dialog.afterClosed().subscribe(() => {
        this.fetchItems();
      }));
    }else {
        this.notificationService.error('', 'אין אפשרות לעדכן רשומה נעולה');
      }
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

    const dialog = this.dialog.open(UpdatePaymentTypeComponent, {
        data: {'typePay': typePay, 'file_id': [file_id]},
        width: '550px',
        panelClass: 'dialog-file'
    });

     this.sub.add(dialog.afterClosed().subscribe(() => {
       this.fetchItems();
     }));

   }

   openUpdateAccountNumberDialog(accNum: string, file_id: number, ref_number: string): void {
     const dialog = this.dialog.open(UpdateAccountNumberComponent, {
       data: {'accNum': accNum, 'file_id': [ file_id ], 'ref_number': ref_number},
       width: '655px',
       panelClass: 'dialog-file'
     });

     this.sub.add(dialog.afterClosed().subscribe(() => {
       this.fetchItems();
     }));
   }

   openUpdatePayDateDialog(date: string, file_id: number): void {
     if (file_id !== -1 || this.checkedRowItems()) {
       if (this.isLockedBroadcast()) {
         const dialog = this.dialog.open(UpdatePaymentDateComponent, {
           data: {'date': date, 'file_id': file_id === -1 ? this.checkedItems.map(item => item.file_id) : [file_id]},
           width: '550px',
           panelClass: 'dialog-file'
         });

         this.sub.add(dialog.afterClosed().subscribe(() => {
           this.fetchItems();
         }));
       }else {
         this.notificationService.error('', 'אין אפשרות לעדכן רשומה נעולה');
       }
     }
   }

  openCommentsDialog(file_id: number): void {
    this.dialog.open(CommentsComponent, {
      data: {'file_id': [ file_id ]},
      width: '550px',
      panelClass: 'dialog-file'
    });
  }

  openWarningMessageComponentDialog(type: boolean): void {
      const title = type ? 'לא רלונטי' : 'מחיקת שורות';
      const body = type ? 'האם ברצונך להפוך שורת אלו ללא רלונטית?' : 'האם ברצונך למחוק שורת אלו?';
      const typeData = type ? 'notRelevant' : 'delete';
      if (this.checkedRowItems()) {
        if(this.isLockedBroadcast()){
          const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};

          this.notificationService.warning(title, body, buttons).then(confirmation => {
            if (confirmation.value) {
              this.processService.update(typeData, '', this.checkedItems.map(item => item.file_id))
                .then(response => {
                  if (response) {
                    this.checkedItems = [];
                    this.isCheckAll = false;
                    this.fetchItems();
                  } else {
                    this.notificationService.error('', 'הפעולה נכשלה');
                  }
                });
            }
          });
        } else {
          this.notificationService.error('', 'אין אפשרות לעדכן רשומה נעולה');
        }
      }
  }

  openSent(): void {
    if (this.checkedRowItems()) {
      if(this.isUnLockedBroadcast()){
        this.processService.unlockProcessFiles(this.processDataService.activeProcess.processID).then( r => {
            if(r['authorized'] == false && r['success'] == 'Message_Sent')
            {
                this.notificationService.success('', 'ממתין לאישור מנהל');
            } else  if(r['authorized'] == true && r['success'] == true) {
              this.notificationService.success('', 'נפתח בצלחה');
              this.fetchItems();
            } else {
              this.notificationService.error('שגיאה', r['success']);
            }
          }
        );
      } else {
        this.notificationService.error('', 'יש לבחור רק נעולים');
      }
    }
  }

  isLockedBroadcast(): boolean {
    if (this.checkedItems.find(item => item.status == 'sent')) {
      return false;
    }
    return true;
  }

  isUnLockedBroadcast(): boolean {
    if (this.checkedItems.find(item => item.status == 'not_sent')) {
      return false;
    }
    return true;
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



  downloadFile(fileId: number): void {
    // const type = fileName.split('.').pop();
    this.spin = true;
    this.processService.downloadFile(fileId).then(response => {
      const fileName = response['fileName'];
      const type = fileName.split('.').pop();
      const byteCharacters = atob(response['blob']);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'application/' + type});
      FileSaver.saveAs(blob, fileName);
      this.spin = false;
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.sub.unsubscribe();
  }
}
