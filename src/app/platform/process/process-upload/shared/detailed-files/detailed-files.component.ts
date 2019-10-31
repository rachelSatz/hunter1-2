import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { CommentsFormComponent } from 'app/shared/_dialogs/comments-form/comments-form.component';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { PaymentType, EmployerProduct } from 'app/shared/_models/process.model';
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
import { AttachReferenceComponent } from './attach-reference/attach-reference.component';
import { GroupTransferComponent } from '../group-transfer/group-transfer.component';
import { DetailsComponent } from '../details.component';

import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-detailed-files',
  templateUrl: './detailed-files.component.html',
  styleUrls: [ './detailed-files.component.css']
})
export class DetailedFilesComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableComponent) dataTable: DataTableComponent;
  newCompanies = [];
  nameCompany = 'company';

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
    { name: 'ref_path', label: 'אסמכתא' , isSort: false, searchable: false },
    { name: 'broadcast_lock', label: 'נעילת שידור' , isSort: false, searchable: false },
    { name: 'records', label: 'פרוט רשומות' , isSort: false, searchable: false }
  ];

  constructor(protected route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router,
              private  processService: ProcessService,
              private processDataService: ProcessDataService,
              protected  notificationService: NotificationService,
              private selectUnitService: SelectUnitService,
              private detailsComponent: DetailsComponent,
              private generalService: GeneralHttpService,
              public userSession: UserSessionService,
              private productService: ProductService) {
  }

  paymentType = PaymentType;
  productType = ProductType;
  spin: boolean;
  sub = new Subscription;
  statuses = Status;
  highlightFileId: number;
  organizationId: number;
  subscription = new Subscription;


  ngOnInit() {
    this.organizationId = this.selectUnitService.currentOrganizationID;
    this.productService.getCompanies().then(response => {
      const column = this.dataTable.searchColumn(this.nameCompany);
      this.newCompanies = response;
      column['searchOptions'].labels = this.newCompanies;
    });
    this.subscription.add(this.selectUnitService.unitSubject.subscribe(() => this.fetchItems()));

  }

  fetchItems () {
    if (this.organizationId !== this.selectUnitService.currentOrganizationID) {
      this.router.navigate(['/platform', 'process', 'table']);
    }
    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnitService.getProcessData();
    }
    this.dataTable.criteria.filters['processId'] = this.processDataService.activeProcess.processID;
    if (this.processDataService.activeProcess.highlightFileId !== undefined) {
      this.dataTable.criteria.filters['fileId'] = this.processDataService.activeProcess.highlightFileId;
    }
    this.processService.getFilesList(this.dataTable.criteria)
      .then( response => {
        this.dataTable.setItems(response,  'file_id');
      });

  }


  openDialogAttachReference(): void {
    if (this.checkedRowItems()) {
      if (this.isLockedBroadcast()) {
        this.dataTable.criteria.filters['processId'] = this.processDataService.activeProcess.processID;
        const dialog = this.dialog.open(AttachReferenceComponent, {
        data: {'file_id': this.dataTable.criteria.checkedItems.map(item => item['file_id']),
               'dataTable': this.dataTable.criteria,
               'processId': this.processDataService.activeProcess.processID},
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
      if (this.dataTable.criteria.checkedItems.length === 0) {
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
      if (comments) {
        this.generalService.getComments(ids, 'groupthing').then(response => {
          if (item) {
            item.comments = [response];
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
      }
    }));
  }

  openWarningMessageComponentDialog(type: boolean): void {
      // const title = type ? 'לא רלונטי' : 'רלונטי';
    // 'מחיקת שורות'
      const body = type ? 'האם ברצונך להפוך שורת אלו ללא רלוונטיות?' : 'האם ברצונך להפוך שורת אלו לרלוונטיות?';
      // const typeData = type ? 'notRelevant' : 'delete';
    const val = type ? false : true;

    if (this.checkedRowItems()) {
        if (this.isLockedBroadcast()) {
          const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};
          const items = this.dataTable.criteria.checkedItems;

          this.notificationService.warning(body, '', buttons).then(confirmation => {
            if (confirmation.value) {
              // this.processService.update('notRelevant', val, items.map(item => item['file_id']) )
              this.processService.update('notRelevant', val, items.map(item => item['file_id']), this.dataTable.criteria )
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
      const items = this.dataTable.criteria.checkedItems;
      // const filesList = { 'filesList' : items.map(item => item['file_id'])};

      if (this.isUnLockedBroadcast()) {
        this.processService.unlockProcessFiles(items.map(item => item['file_id']), this.dataTable.criteria).then( r => {
            if (r['authorized'] === false && r['success'] === 'Message_Sent') {
                this.notificationService.success('', 'ממתין לאישור מנהל');
            } else  if (r['authorized'] === true && r['success'] === true) {
              this.notificationService.success('', 'נפתח בהצלחה');
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

    this.detailsComponent.type = 'records';
    this.router.navigate(['/platform', 'process', 'new', 1, 'details', 'records', fileId]);
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

  getTitle(employer_products: EmployerProduct[]): string[] {
    const title = [];
    if (employer_products.length === 0) {
      title[0] = '';
    } else if (employer_products.length > 1) {
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
    this.subscription.unsubscribe();
  }
}
