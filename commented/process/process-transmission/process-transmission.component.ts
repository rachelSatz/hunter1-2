import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { TransmissionIntroFormComponent } from './transmission-intro-form/transmission-intro-form.component';
import { TransmissionProductDetailsComponent } from './transmission-product-details/transmission-product-details.component';

import { ProcessService } from '../../../shared/_services/http/process.service';

import { Process } from '../../../shared/_models/process.model';
import { EmployeePayment } from '../../../shared/_models/employee-payment.model';
import { TransmissionData } from '../../../shared/_models/transmission-data.model';

import { TransmissionBankDetailsComponent } from './transmission-bank-details/transmission-bank-details.component';
import { TransmissionDateComponent } from './transmission-date/transmission-date.component';
import { TransmissionCommentComponent } from '../process-payment/transmission-comment/transmission-comment.component';
import { SendFile } from '../../../shared/_models/send-file.model';
import { NotificationService } from '../../../shared/_services/notification.service';
import { PopupRememberRefundComponent } from "./popupRememberRefund/popup-remember-refund.component";
import { Manufacturer } from "../../../shared/_models/manufacturer.model";
import { ConfirmDisclaimerFileComponent } from "./confirm-disclaimer-file/confirm-disclaimer-file.component";

@Component({
  selector: 'app-process-transmission',
  templateUrl: './process-transmission.component.html',
  styleUrls: ['./process-transmission.component.css']

})
export class ProcessTransmissionComponent implements OnInit {

  process: Process;
  payments: SendFile[] = [];
  public Send: boolean = false;
  public spin = false;
  public checkboxValue: boolean = false;
  public checklist: { fileId: number }[] = [{ fileId: 0 }];

  public checkBoxValue = true;

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private processService: ProcessService,
    private notificationService: NotificationService, private router: Router) { }
  GetMainTitle() {
    if (!this.Send) {
      if (this.process.NegativeProcess) {
        return "תהליך שידור שלילי";
      }
      return "תהליך שידור";
    }
    else {
      return "שידור בוצע בהצלחה";
    }
  }
  GetSecondaryTitle() {
    if (!this.Send) {
      if (this.process.NegativeProcess) {
        return "להלן פרטי החזר מתוך קובץ ה-XML";
      }
      return "להלן פרטי הנתונים הפנסיונים לשידור לקופות";
    }
    else {
      if (this.process.NegativeProcess) {
        
          return "בקשת ההחזר הועברה לקופות בהצלחה!";
        }
        return "להלן סיכום נתוני השידור";
      }
    }
    ngOnInit() {
      this.process = this.route.parent.snapshot.data['process'].data.process;

      let getSend = sessionStorage.getItem('Send' + this.process.id);
      console.log("getSend", getSend);
      console.log("mode", getSend);
      if (getSend && getSend == "true") {
        this.Send = true;
      }


      sessionStorage.setItem('Send' + this.process.id, this.Send.toString());
      /*if (this.process.stepStatus !== 1) {
        setTimeout(() => this.setDialog(), 0);
      } else {*/
      this.loadData();
      /* }*/
    }
    GetrouterLink() {

      const url = 'payment';
      this.router.navigate(['/process', 'new', this.process.id, url]);

    }
  private loadData(): void {
    this.spin = true;
    this.processService.loadTransmissionTableData(this.process.id).then(response => {
      this.payments = response['data'];
      this.spin = false;
      this.initChecklist(response['data']);
    });
  }

  private setDialog(): void {
    const dialog = this.dialog.open(TransmissionIntroFormComponent, {
      data: this.process,
      disableClose: true
    });

    dialog.afterClosed().subscribe(data => {
      //this.launchTransmission(data);
    });
  }



  initChecklist(data) {
    for (let i = 0; i < data.length; i++) {
      this.checklist.push({ fileId: data[i].id });
    }
  }

  IndexList(i) {
    const x = this.checklist.filter(y => y.fileId === i);
    if (x.length === 0) {
      this.checklist.push({ fileId: i });
    } else {
      this.checklist.splice(this.checklist.findIndex(x => x.fileId === i), 1)
    }
  }

  clearSelectAllIndexList() {
    if (this.checkBoxValue) {
      for (let i = 0; i < this.payments.length; i++) {
        this.checklist.push({ fileId: this.payments[i].id });
      }
    } else {
      this.checklist = [{ fileId: 0 }];
    }
  }

  openProductDetailsDialog(paymentID: number): void {
    this.dialog.open(TransmissionProductDetailsComponent, {
      data: paymentID
    });
  }

  openBankDetailsDialog(payment: EmployeePayment): void {
    const payDetails: { file: EmployeePayment, process: Process } = { file: payment, process: this.process };
    const dialog = this.dialog.open(TransmissionBankDetailsComponent, {
      data: payDetails,
      width: '94%'
    });
    dialog.afterClosed().subscribe(response => {
      this.loadData();
    });
  }

  openCommentDialog(payment: EmployeePayment): void {
    const payDetails: { file: EmployeePayment, process: Process } = { file: payment, process: this.process };
    const dialog = this.dialog.open(TransmissionCommentComponent, {
      data: payDetails
    });
    dialog.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  openDateDialog(payment: EmployeePayment): void {
    const payDetails: { file: EmployeePayment, process: Process } = { file: payment, process: this.process };
    const dialog = this.dialog.open(TransmissionDateComponent, {
      data: payDetails,
    });
    dialog.afterClosed().subscribe(response => {
      this.loadData();
    });
  }
  sendHomePage() {
    if (this.process.HaveNegativeProcess) {
      const payDetails: { fileUplode: any } = { fileUplode: this.process };
      const dialog = this.dialog.open(PopupRememberRefundComponent, {
        data: payDetails,
        width: '50%'
      });


    }
    else {
      this.router.navigate(['dashboard'])
    }

  }
  sendUplodePage() {
    this.router.navigate(['process/new/upload'], {
      queryParams: {
        employer: this.process.employer.id,
        year: this.process.year,
        month: this.process.month,
        Neg: true,
      }
    });
  }
  ConfirmDisclaimerFile(){
    if(this.process.NegativeProcess){
       this.processService.getManufacturerByprocess(this.process.id).then(response => {
       let manufacturers:Manufacturer[]=response;

         const payDetails: { fileUplode: Process,manufacturers: Manufacturer[]} = { fileUplode: this.process,manufacturers:manufacturers };
      const dialog = this.dialog.open(ConfirmDisclaimerFileComponent, {
        data: payDetails,
        width: '90%'
      });
        dialog.afterClosed().subscribe(data => {
        this.Send=data;
    });
    });
    }
  }
  sendDetails() {
    if (!this.checkboxValue) {
      this.notificationService.showResult("עליך לאשר שבדקת את הנתוני התשלום", "error");
      return;
    }
    if (this.checklist.length > 0) {
      this.checklist.splice(this.checklist.findIndex(x => x.fileId === 0), 1);
    }
    this.spin = true;
    this.processService.postTransition(this.process, this.checklist)
      .then(response => {
        this.spin = false;
        if (response.Success == 0) {
          this.Send = true;
          sessionStorage.setItem('Send' + this.process.id, this.Send.toString());
        }



        this.notificationService.showResult(response.Message, response.Success == "1" ? "error" : "success");


      });

  }

}
