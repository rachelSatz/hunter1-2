import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { CommentsFormComponent } from 'app/shared/_dialogs/comments-form/comments-form.component';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { PaymentType } from 'app/shared/_models/process.model';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProductService } from 'app/shared/_services/http/product.service';
import { ProductType } from 'app/shared/_models/product.model';
import { Status } from 'app/shared/_models/file-feedback.model';

import { UpdateAccountNumberComponent } from './update-account-number/update-account-number.component';
import { UpdatePaymentDateComponent } from './update-payment-date/update-payment-date.component';
import { UpdatePaymentTypeComponent } from './update-payment-type/update-payment-type.component';

import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { OpenSentComponent } from 'app/platform/process/process-upload/shared/detailed-files/open-sent/open-sent.component';
import { PaymentInstructionsComponent } from 'app/platform/process/process-loading/payment-instructions/payment-instructions.component';
import { ReferenceComponent } from 'app/platform/process/process-loading/reference/reference.component';
import { GroupTransferComponent } from 'app/shared/shared/detailed-files/group-transfer/group-transfer.component';


@Component({
  selector: 'app-detailed-files',
  templateUrl: './detailed-files.component.html',
  styleUrls: [ './detailed-files.component.css']
})

export class DetailedFilesComponent implements OnInit , OnDestroy {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;


  newCompanies = [];
  nameCompany = 'company';
  nameRecords = 'records';
  paymentType = PaymentType;
  productType = ProductType;
  spin: boolean;
  sub = new Subscription;
  statuses = Status;
  organizationId: number;
  subscription = new Subscription;
  title = {};
  planId;
  isReference = false;


  readonly columns =  [
    { name: 'group_id', label: 'מס קבוצה' , searchable: false},
    { name: this.nameCompany , sortName: 'group__product__company__name', label: 'חברה מנהלת' , searchOptions: { labels: [] } },
    { name: 'product_pay', label: 'קופה בשכר' , isSort: false  , searchable: false },
    { name: 'product_type', label: 'סוג מוצר' , isSort: false, searchable: false },
    { name: 'product', sortName: 'group__product__code', label: 'מ"ה' },
    { name: 'payment_type', label: 'סוג תשלום' , searchable: false },
    { name: 'payment_identifier', label: 'מס אסמכתא', isSort: false, searchable: false },
    // /צק
    { name: 'account', label: 'מס חשבון' , isSort: false, searchable: false },
    { name: 'deposit_date', label: 'תאריך תשלום' , searchable: false },
    { name: 'block_sum', label: 'סכום' },
    { name: 'id', label: 'מספר מזהה' , searchable: false },
    { name: 'comment', label: 'הערות' , isSort: false, searchable: false },
    { name: 'status', label: 'סטטוס' , isSort: false, searchable: false },
    { name: 'broadcast_lock', label: 'נעילת שידור' , isSort: false, searchable: false },
    { name: 'records', label: 'פרוט רשומות' , isSort: false, searchable: false, isDisplay: true}
  ];

  constructor(protected route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router,
              private processService: ProcessService,
              public processDataService: ProcessDataService,
              protected notificationService: NotificationService,
              private payment: PaymentInstructionsComponent,
              private reference: ReferenceComponent,
              private selectUnit: SelectUnitService,
              private generalService: GeneralHttpService,
              public userSession: UserSessionService,
              private helpers: HelpersService,
              private productService: ProductService) {
  }

  ngOnInit() {
    if (this.router.url.indexOf('reference') !== -1) {
      this.isReference = true;
    }

    if (this.processDataService.activeProcess === undefined || this.processDataService.activeProcess.processID === undefined) {
      this.processDataService = this.selectUnit.getProcessData();
    }
    if (this.processDataService.activeProcess !== undefined) {
      this.dataTable.criteria.isCheckAll = true;
      this.planId = this.route.snapshot.queryParams['planId'];
      this.organizationId = this.selectUnit.currentOrganizationID;
      this.productService.getCompanies().then(response => {
        const column = this.dataTable.searchColumn(this.nameCompany);
        this.newCompanies = response;
        column['searchOptions'].labels = this.newCompanies;
      });
      this.subscription.add(this.selectUnit.unitSubject.subscribe(() => this.fetchItems()));
      this.payment.rows = this.dataTable.criteria;
      this.reference.rows = this.dataTable.criteria;
    }
  }

  fetchItems () {
    if (this.router.url.indexOf('reference') !== -1) {
      const column = this.dataTable.searchColumn(this.nameRecords);
      column['isDisplay'] = false;
    }
    this.payment.rows =  this.dataTable.criteria;
    this.reference.rows =  this.dataTable.criteria;
    if (+this.organizationId !== +this.selectUnit.currentOrganizationID) {
      this.router.navigate(['/platform', 'process', 'table']);
    }
    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnit.getProcessData();
    }
    this.dataTable.criteria.filters['processId'] = this.processDataService.activeProcess.processID;
    if (this.processDataService.activeProcess.highlightFileId !== undefined) {
      this.dataTable.criteria.filters['fileId'] = this.processDataService.activeProcess.highlightFileId;
    }

    this.processService.getFilesList(this.dataTable.criteria, this.isReference)
      .then(response => {
        // if (response.items.filter(n => n.in_process === true).length === response.items.length ) {
        //   this.dataTable.criteria.isCheckAll = true;
        // } else {
        //   this.dataTable.criteria.checkedItems = response.items.filter(n => n.in_process === true);
        // }
        this.dataTable.setItems(response, 'file_id');
        // this.dataTable.criteria.checkedItems.map((item) => {
        //   item.checked =  item.in_process;
        // });
        this.getTitle();
     });
  }

  openGroupTransferDialog(): void {
    if (this.checkedRowItems()) {
      if (this.isLockedBroadcast()) {
        const items = this.dataTable.criteria.checkedItems;
        const ids = items.map(item => item['file_id']);
          const dialog = this.dialog.open(GroupTransferComponent, {
            data: { 'ids': ids,
              'processId': this.processDataService.activeProcess.processID, 'type': 'groupthing',
              'dataTable': this.dataTable.criteria
            },
            width: '800px',
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

  checkedRowItems(): boolean {
    if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
      this.dataTable.setNoneCheckedWarning();
      return false;
    }
    return true;
  }

   openUpdateTypePayDialog(typePay: string, file_id: number): void {
    const dialog = this.dialog.open(UpdatePaymentTypeComponent, {
        data: {'typePay': typePay, 'file_id': [file_id], 'dataTable': this.dataTable.criteria},
        width: '550px',
        panelClass: 'dialog-file'
    });

     this.sub.add(dialog.afterClosed().subscribe(() => {
       this.endAction();
     }));

   }

   openUpdateAccountNumberDialog(accNum: string, file_id: number, ref_number: string): void {
     const dialog = this.dialog.open(UpdateAccountNumberComponent, {
       data: {'accNum': accNum, 'file_id': [ file_id ], 'ref_number': ref_number, 'dataTable': this.dataTable.criteria},
       width: '655px',
       panelClass: 'dialog-file'
     });

     this.sub.add(dialog.afterClosed().subscribe(() => {
       this.endAction();
     }));
   }

   openUpdatePayDateDialog(val: string, file_id: number): void {
     if (file_id !== -1 || this.checkedRowItems()) {
       if (this.isLockedBroadcast()) {
         const date = val;
         const items = this.dataTable.criteria.checkedItems;

         const dialog = this.dialog.open(UpdatePaymentDateComponent, {
           data: {'date': date,
                  'file_id': file_id === -1 ? items.map(item => item['file_id']) : [file_id],
                  'dataTable': this.dataTable.criteria
           },
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

  openCommentsDialog(item?: any): void {
    let ids = [];
    if (!item) {
      if (this.dataTable.criteria.checkedItems.length === 0 && !this.dataTable.criteria.isCheckAll) {
        this.dataTable.setNoneCheckedWarning();
        return;
      }

      ids = this.dataTable.criteria.checkedItems.map(i => i['file_id']);
    } else {
      ids = [item.file_id];
    }

    const dialog =  this.dialog.open(CommentsFormComponent, {
      data: {'ids': ids, 'contentType': 'groupthing', 'comments'  : item ?  item.comments : [],
        'criteria': this.dataTable.criteria},
      width: '550px',
      panelClass: 'dialog-file'
    });

    this.sub.add(dialog.afterClosed().subscribe(comments => {
      this.helpers.setPageSpinner(true);
      if (comments) {
        if (!this.dataTable.criteria.isCheckAll) {
        this.generalService.getComments(ids, 'groupthing').then(response => {
          if (item) {
            item.comments = response;
            item.checked = false;
          } else {
            this.dataTable.criteria.checkedItems.forEach(obj => {
              obj['comments'] = response.filter(r => r['object_id'] === obj['file_id']);
              obj['checked'] = false;
            });
          }
          this.dataTable.criteria.checkedItems = [];
          this.dataTable.criteria.isCheckAll = false;
        });
        }else {
          this.dataTable.criteria.isCheckAll = false;
          this.fetchItems();
        }
        this.helpers.setPageSpinner(false);
      } else {
        this.helpers.setPageSpinner(false);
      }
    }));
  }

  openWarningMessageComponentDialog(type: boolean): void {
    const body = type ? 'האם ברצונך להפוך שורת אלו ללא רלוונטיות?' : 'האם ברצונך להפוך שורת אלו לרלוונטיות?';
    const val = type ? false : true;

    if (this.checkedRowItems()) {
        if (this.isLockedBroadcast()) {
          const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};
          const items = this.dataTable.criteria.checkedItems;

          this.notificationService.warning(body, '', buttons).then(confirmation => {
            if (confirmation.value) {
              this.processService.update('notRelevant',
                val, items.map(item => item['file_id']),
                this.dataTable.criteria,  this.processDataService.activeProcess.processID)
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

      if (this.isUnLockedBroadcast()) {
        const role = this.userSession.getRole();

        if (role !== 'admin') {
          const dialog = this.dialog.open(OpenSentComponent, {
            width: '550px',
          });

          this.sub.add(dialog.afterClosed().subscribe((comment) => {
            this.unLockedBroadcast(comment);
          }));
        } else {
          this.unLockedBroadcast('');
        }

      } else {
        this.notificationService.error('', 'יש לבחור רק נעולים');
      }
    }else {
      this.dataTable.setNoneCheckedWarning();
    }
  }
  unLockedBroadcast(comment?: string): void {
    const items = this.dataTable.criteria.checkedItems;
    this.processService.unlockProcessFiles(items.map(item => item['file_id']),
      this.dataTable.criteria, comment, this.processDataService.activeProcess.processID).then(r => {
        if (r['authorized'] === false && r['success'] === 'Message_Sent') {
          this.notificationService.success('', 'ממתין לאישור מנהל');
        } else if (r['authorized'] === true && r['success'] === true) {
          this.notificationService.success('', 'נפתח בהצלחה');
          this.endAction();
        } else {
          this.notificationService.error('שגיאה', r['success']);
        }
      }
    );
  }

   sentFile(): void {
    if (this.checkedRowItems()) {
      if (this.isLockedBroadcast()) {
        if (this.isRelevant()) {
          this.processService.getCommentBroadcast(this.processDataService.activeProcess.employer_id).then(comment => {
          const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};
          if (comment === null) {comment = ''; }
          this.notificationService.warning('אשר שידור', comment , buttons).then(confirmation => {
              if (confirmation.value) {
                this.processService.transfer(
                  this.dataTable.criteria.checkedItems.map(item => item['file_id']),
                  'filesList', this.dataTable.criteria)
                  .then(response => {
                    if (response.ok === false) {
                      const title = response.status === 400 ? 'סטטוס או תאריך תשלום לא תקינים' :
                        response.status === 404 ? 'לא נמצא קובץ לשידור' : 'השידור נכשל';
                      this.notificationService.error('', title);
                    } else {
                      this.processService.deletePlanTask(this.processDataService.activeProcess.processID);
                      this.notificationService.success('', 'שודר בהצלחה');
                      this.endAction();
                    }
                  });
              }
            });
          });
        } else {
          this.notificationService.error('', 'אין אפשרות לשדר רשומה לא רלוונטית');
        }
      } else {
        this.notificationService.error('', 'אין אפשרות לשדר רשומה ששודרה');
      }
    }
  }

  detailsRecords(fileId: number): void {
    this.processDataService.activeProcess.returnDetails = true;
    this.processDataService.activeProcess.incorrect = false;

    // this.detailsComponent.type = 'records';
    this.router.navigate(['/platform', 'process', 'new', 'update', 'payment-instructions', 'records', fileId]);
  }

  isLockedBroadcast(): boolean {
    if (this.dataTable.criteria.checkedItems.find(item => item['status'] === 'sent')) {
      return false; }
    return true;
  }

  isRelevant(): boolean {
    if (!this.dataTable.criteria.isCheckAll &&
      this.dataTable.criteria.checkedItems.find(item => item['is_relevant'] === false)) {
      return false; }
    return true;
  }

  isUnLockedBroadcast(): boolean {
    if (this.dataTable.criteria.checkedItems.find(item => item['status'] === 'not_sent')) {
      return false; }
    return true;
  }

  getTitle(): void {
    this.dataTable.items.forEach( it => {
      it.employer_products.forEach( e => {
        if (it.file_id in  this.title) {
          const p = e.code + ' - ' + e.name;
          if (!this.title[it.file_id].includes(p)) {
            this.title[it.file_id] = this.title[it.file_id] + '\n' + p;
          }
        } else {
          this.title[it.file_id] = e.code + ' - ' + e.name;
        }
      });
    });
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
    this.subscription.unsubscribe();
  }
}
