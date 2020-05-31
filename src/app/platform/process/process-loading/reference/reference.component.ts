import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { fade } from 'app/shared/_animations/animation';
import { ProcessLoadingComponent } from '../process-loading.component';
import { DataTableCriteria } from 'app/shared/data-table/classes/data-table-criteria';
import { DatePipe, Location } from '@angular/common';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { AttachReferenceComponent } from '../attach-reference/attach-reference.component';
import { MatDialog } from '@angular/material';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { NgForm } from '@angular/forms';
import { Department } from 'app/shared/_models/department.model';
import { DepartmentService } from 'app/shared/_services/http/department.service';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css', './../../process-loading/process-loading.component.css'],
  animations: [ fade ]
})
export class ReferenceComponent implements OnInit {

  constructor(private router: Router,
              public route: ActivatedRoute,
              public datePipe: DatePipe,
              private generalService: GeneralHttpService,
              private dialog: MatDialog,
              private location: Location,
              private processService: ProcessService,
              private notificationService: NotificationService,
              private selectUnit: SelectUnitService,
              public processDataService: ProcessDataService,
              private departmentService: DepartmentService,
              public processLoading: ProcessLoadingComponent,

  ) {}

  department = new Department();
  banks = [];
  isEdit = false;
  isEditWithdrawal= false;
  bankBranchesDeposit = [];
  bankBranchesWithdrawal = [];
  today = new Date().toJSON().split('T')[0];
  activeUrl = 'files';
  hasShow: boolean;
  hasShowBank: boolean;
  valid: boolean;
  @Input() rows: DataTableCriteria;
  date: any;
  processId: number;
  isDate: boolean;
  sum: string;

  headers = [
    {label: 'מעקב ברמת קובץ',    url: 'files'  },
    {label: 'מעקב ברמת עובד',   url: 'records' },
  ];

  ngOnInit() {
    this.loadBanks();
    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnit.getProcessData();
    }

    this.departmentService.getDepartment(this.processDataService.activeProcess.departmentId).then(response => {
      this.department = response;
    });

    this.processId = this.processDataService.activeProcess.processID;
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.setActiveUrl(event.url);
      }
    });
    this.processService.checkIsDate(this.processDataService.activeProcess.processID,
      this.processDataService.activeProcess.rows,
      this.processDataService.activeProcess.isCheckAll).then(response => {
      this.isDate = response['is_date'];
      this.sum = response['block_sum'];
      this.processDataService.activeProcess.sum = this.sum;
      this.processDataService.activeProcess.num_file = response['num_file'];
    });
  }

  loadBanks(): void {
    this.generalService.getBanks(true).then(banks => {
      this.banks = banks;
    });
  }

  private setActiveUrl(url: string): void {
    const urlSplit = url.split('/');
    this.activeUrl = urlSplit[urlSplit.length - 1];
  }

  attachmentReference(): void {
    this.dialog.open(AttachReferenceComponent, {
      data: {processId: this.processId},
      width: '630.6px',
      height: '492.6px',
      panelClass: 'attach-dialog'
    });
  }

  save(): void {
    if (this.checkedRowItems()) {
      const dateFormat = this.datePipe.transform(this.date, 'yyyy-MM-dd');
      const filesList = this.rows.checkedItems.map(item => item['file_id']);

      this.processService.updateDate('date', dateFormat, filesList,
        this.rows, this.processDataService.activeProcess.processID,
        this.processDataService.activeProcess.rows,
        this.processDataService.activeProcess.isCheckAll).then(response => {
          this.isDate = response;
          console.log(this.location.path());
          let p = this.location.path();
          if (!this.location.path().includes('file')) {
             p = p + '/file';
          } else {
            p = p.replace('/file', '');
          }
          this.router.navigate([p]);
        // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        //     this.router.navigate([this.location.path()]);
        //     console.log(this.location.path());
        //   }
        // );
      });
    }
  }

  checkedRowItems(): boolean {
    if (this.rows.checkedItems.length === 0 && !this.rows.isCheckAll) {
      this.notificationService.error('לא נבחרו רשומות', 'יש לסמן רשומות מהטבלה');
      return false;
    }
    return true;
  }

  setPage(): void {
    if ((this.isDate && this.valid) || this.processDataService.activeProcess.is_references) {
      if (this.processDataService.activeProcess.is_references) {
        this.processLoading.setPage(4, true);
      } else {
        this.processService.authorizationReceiptCertificate(this.processDataService.activeProcess.processID)
          .then(response => {
            if (response['ok']) {
              this.notificationService.success('', 'האישור התקבל בהצלחה');
              this.processLoading.setPage(4, true);
            } else {
              this.notificationService.error('', 'שגיאה באישור');
            }
          });
      }
    }
  }

  selectedBankBranch(val?: string): void {
    const  bankId = val === 'Withdrawal' ? this.department.bank_account_withdrawal.bank_id :
      this.department.bank_account_deposit.bank_id;
    const  branchId = val === 'Withdrawal' ? this.department.bank_account_withdrawal.branch_id :
      this.department.bank_account_deposit.branch_id;

    const selectedBank = this.banks.find(bank => {
      return +bank.id === +bankId;
    });

    if (!selectedBank.bank_branches.find( b => {
      return +b.id === +branchId; })) {
      if (val === 'Withdrawal') {
        this.department.bank_account_withdrawal.branch_id = 0;
      } else {
        this.department.bank_account_deposit.branch_id = 0;
      }
    }
    if (val === 'Withdrawal') {
      this.bankBranchesWithdrawal = selectedBank ? selectedBank.bank_branches : [];
    } else {
      this.bankBranchesDeposit = selectedBank ? selectedBank.bank_branches : [];
    }
  }

  saveBank(form: NgForm): void {
    if (form.valid) {
        this.departmentService.update(this.department)
          .then(response => {
              this.notificationService.success('העדכון בוצע בהצלחה', '');
              this.isEditWithdrawal = false;
              this.isEdit = false;
          });
      }
  }

  validCopy(): boolean {
    return this.department.bank_account_deposit.bank_id > 0 && this.department.bank_account_deposit.branch_id > 0
      && this.department.bank_account_deposit.number !== '0';
  }

}
