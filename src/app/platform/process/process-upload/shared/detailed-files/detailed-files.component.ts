import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { PaymentType, EmployerProduct } from 'app/shared/_models/process.model';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProductType } from 'app/shared/_models/product.model';
import { Status } from 'app/shared/_models/file-feedback.model';

import { UpdateAccountNumberComponent } from './update-account-number/update-account-number.component';
import { UpdatePaymentDateComponent } from './update-payment-date/update-payment-date.component';
import { UpdatePaymentTypeComponent } from './update-payment-type/update-payment-type.component';
import { AttachReferenceComponent } from './attach-reference/attach-reference.component';
import { CommentsComponent } from './comments/comments.component';

import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-detailed-files',
  templateUrl: './detailed-files.component.html',
  styleUrls: [ './detailed-files.component.css']
})
export class DetailedFilesComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  readonly columns =  [
    { name: 'group_id', label: 'מס קבוצה' },
    { name: 'company' , sortName: 'group__product__company__name', label: 'חברה מנהלת' },
    { name: 'product_pay', label: 'קופה בשכר' , isSort: false  },
    { name: 'product_type', label: 'סוג מוצר' , isSort: false},
    { name: 'product', sortName: 'group__product__code', label: 'מ"ה' },
    { name: 'payment_type', label: 'סוג תשלום' },
    { name: 'payment_identifier', label: 'מס אסמכתא', isSort: false},
    { name: 'account', label: 'מס חשבון/צק' , isSort: false},
    { name: 'deposit_date', label: 'תאריך תשלום' },
    { name: 'block_sum', label: 'סכום' },
    { name: 'id', label: 'מספר מזהה' },
    { name: 'comment', label: 'הערות' , isSort: false},
    { name: 'status', label: 'סטטוס' , isSort: false},
    { name: 'ref_path', label: 'אסמכתא' , isSort: false},
    { name: 'broadcast_lock', label: 'נעילת שידור' , isSort: false},
    { name: 'records', label: 'פרוט רשומות' , isSort: false}
  ];

  constructor(protected route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router,
              private  processService: ProcessService,
              private processDataService: ProcessDataService,
              protected  notificationService: NotificationService,
              private selectUnitService: SelectUnitService) {
  }

  paymentType = PaymentType;
  productType = ProductType;
  spin: boolean;
  sub = new Subscription;
  statuses = Status;

  ngOnInit() {
  }

  fetchItems () {
    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnitService.getProcessData();
    }
    this.dataTable.criteria.filters['processId'] = this.processDataService.activeProcess.processID;
    this.processService.getFilesList(this.dataTable.criteria)
      .then( response => {
        this.dataTable.setItems(response);
      });
  }


  openDialogAttachReference(): void {
    if (this.checkedRowItems()) {
      if (this.isLockedBroadcast()) {
      const dialog = this.dialog.open(AttachReferenceComponent, {
        data: {'file_id': this.dataTable.criteria.checkedItems.map(item => item['file_id'])},
        width: '550px',
        panelClass: 'send-email-dialog'
      });

      this.sub.add(dialog.afterClosed().subscribe(() => {
        this.endAction();
      }));
    }else {
        this.notificationService.error('', 'אין אפשרות לעדכן רשומה נעולה');
      }
    }
  }

  checkedRowItems(): boolean {
    if (this.dataTable.criteria.checkedItems.length === 0) {
      this.dataTable.setNoneCheckedWarning();
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
       this.endAction();
     }));

   }

   openUpdateAccountNumberDialog(accNum: string, file_id: number, ref_number: string): void {
     const dialog = this.dialog.open(UpdateAccountNumberComponent, {
       data: {'accNum': accNum, 'file_id': [ file_id ], 'ref_number': ref_number},
       width: '655px',
       panelClass: 'dialog-file'
     });

     this.sub.add(dialog.afterClosed().subscribe(() => {
       this.endAction();
     }));
   }

   openUpdatePayDateDialog(date: string, file_id: number): void {
     if (file_id !== -1 || this.checkedRowItems()) {
       if (this.isLockedBroadcast()) {
         const dialog = this.dialog.open(UpdatePaymentDateComponent, {
           data: {'date': date, 'file_id': file_id === -1 ?
               this.dataTable.criteria.checkedItems.map(item => item['file_id']) : [file_id]},
           width: '550px',
           panelClass: 'dialog-file'
         });

         this.sub.add(dialog.afterClosed().subscribe(() => {
           this.endAction();
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
        if (this.isLockedBroadcast()) {
          const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};

          this.notificationService.warning(title, body, buttons).then(confirmation => {
            if (confirmation.value) {
              this.processService.update(typeData, '', this.dataTable.criteria.checkedItems.map(item => item['file_id']))
                .then(response => {
                  if (response) {
                    this.endAction();
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
    if (this.dataTable.criteria.checkedItems.length > 0 || this.dataTable.criteria.isCheckAll) {
      const processId = { 'processId' : this.processDataService.activeProcess.processID};
      let filesList =  {};
      if (!this.dataTable.criteria.isCheckAll) {
        filesList = { 'filesList' : this.dataTable.criteria.checkedItems.map(item => item['file_id'])};
      }

      if (this.isUnLockedBroadcast()) {
        this.processService.unlockProcessFiles(!this.dataTable.criteria.isCheckAll ? filesList : processId).then( r => {
            if (r['authorized'] === false && r['success'] === 'Message_Sent') {
                this.notificationService.success('', 'ממתין לאישור מנהל');
            } else  if (r['authorized'] === true && r['success'] === true) {
              this.notificationService.success('', 'נפתח בצלחה');
              this.endAction();
            } else {
              this.notificationService.error('שגיאה', r['success']);
            }
          }
        );
      } else {
        this.notificationService.error('', 'יש לבחור רק נעולים');
      }
    }else {
      this.dataTable.setNoneCheckedWarning();
    }
  }

   sentFile(): void {
    if (this.checkedRowItems()) {
      if (this.isLockedBroadcast()) {
        const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};

        this.notificationService.warning('אשר שידור', '', buttons).then(confirmation => {
          if (confirmation.value) {
            this.processService.transfer( this.dataTable.criteria.checkedItems.map(item => item['file_id']), 'filesList')
              .then(response => {
                if (response.ok === false) {
                  this.notificationService.error('', 'השידור נכשל');
                }else {
                  this.notificationService.success('', 'שודר בהצלחה');
                  this.endAction();
                }
              });
          }
        });
      } else {
        this.notificationService.error('', 'אין אפשרות לשדר רשומה ששודרה');
      }
    }
  }

  detailsRecords(fileId: number): void {
    this.processDataService.activeProcess.returnDetails = true;
    console.log(this.route.parent);
    this.router.navigateByUrl('/details', {skipLocationChange: true}).then(() =>
      this.router.navigate(['/platform', 'process', 'new', 1, 'details'], {queryParams: {name: fileId}}));
      // location.reload();
  }

  isLockedBroadcast(): boolean {
    if (this.dataTable.criteria.checkedItems.find(item => item['status'] === 'sent')) {
      return false; }
    return true;
  }

  isUnLockedBroadcast(): boolean {
    if (this.dataTable.criteria.checkedItems.find(item => item['status'] === 'not_sent')) {
      return false; }
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

  endAction(): void {
    this.dataTable.criteria.checkedItems = [];
    this.dataTable.criteria.isCheckAll = false;
    this.fetchItems();
  }




  downloadFile(fileId: number): void {
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
    this.sub.unsubscribe();
  }
}
