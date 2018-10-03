import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { trigger, state, style, animate, transition } from '@angular/animations';

import { TransitionDialogComponent } from '../../../shared/transition-dialog/transition-dialog.component';
import { PaymentPromptComponent } from './payment-prompt/payment-prompt.component';

import { EmployerService } from '../../../shared/_services/http/employer.service';
import { ProcessService } from '../../../shared/_services/http/process.service';
import { ProcessFileService } from '../../../shared/_services/http/process-file.service';
import { NotificationService, NotificationType } from '../../../shared/_services/notification.service';

import { Process } from '../../../shared/_models/process.model';
import { Employer } from '../../../shared/_models/employer.model';

import { MONTHS } from '../../../shared/_const/months';
import { Select2Options } from '../../../shared/_const/select2-options';
import { UploadEvent, UploadFile, FileSystemFileEntry } from 'ngx-file-drop';
import { Select2OptionData } from 'ng2-select2/ng2-select2';
import { Contact } from '../../../shared/_models/contact.model';

@Component({
  selector: 'app-process-upload',
  templateUrl: './process-upload.component.html',
  styleUrls: ['./process-upload.component.css'],
  animations: [
    trigger('fadeIn', [
      state('inactive', style({
        opacity: '0',
        display: 'none'
      })),
      state('active', style({
        opacity: '1',
        display: '*'
      })),
      transition('inactive => active', animate('400ms ease-in')),
      transition('active => inactive', animate('400ms ease-out'))
    ])
  ],
  providers: [ProcessService, NotificationService]
})
export class ProcessUploadComponent implements OnInit, OnDestroy {

  abc = 4;


  HaveNegativeProcess: boolean = false;
  contacts: Contact[];
  process: Process;
  EmployerID: number = -1
  employersselect2: Select2OptionData[] = [];
  readonly months = MONTHS;
  readonly currentYear = new Date().getFullYear();
  employers: Employer[];
  paymentsFile: File;
  selectedUploadMethod: 'xml' | 'manual';
  public spin = false;
  fileTypeError = false;
  noFileError = false;
  Neg: boolean = false;
  activeUploadStep = 1;
  isPaymentTransferred: boolean;

  paymentDialogSubscription: Subscription;

  select2Options = Select2Options;

  constructor(private router: Router, private route: ActivatedRoute, private employerService: EmployerService,
    private processService: ProcessService, private processFileService: ProcessFileService,
    private notificationService: NotificationService, private dialog: MatDialog) { }
  public files: UploadFile[] = [];




  ngOnInit() {

    if (this.route.parent.snapshot.data['process']) {
      this.process = this.route.parent.snapshot.data['process'].data.process;
    } else {
      this.process = new Process;
      this.process.year = this.currentYear;
    }
    const employer = this.route.snapshot.queryParams['employer'];
    const year = this.route.snapshot.queryParams['year'];
    const month = this.route.snapshot.queryParams['month'];
    const Neg = this.route.snapshot.queryParams['Neg'];


    this.employers = this.route.parent.snapshot.data.employers;
    this.employersselect2 = this.setSelect2Data(this.employers, 'בחר מעסיק')

    if (year && employer && month && Neg) {
      console.log("employer", employer);

      this.process.year = +year;
      this.process.month = +month;
      this.Neg = Neg;

      this.changeEmployer(employer);
      this.RemoveParamsurl();
    }



  }

  RemoveParamsurl() {
    const index = this.router.url.indexOf('?');
    if (index > -1) {
      const url: string = this.router.url.substring(0, index);
      this.router.navigateByUrl(url);
    }
  }
  private setSelect2Data(values: Object[], textLabel: string): Select2OptionData[] {


    const data = [
      { id: '-1', text: 'בחר מעסיק' }
    ];

    for (let i = 1; i < values.length; i++) {
      data[i] = { id: values[i]['id'], text: values[i]['name'] };
    }

    return data;
  }
  getTitle(): string {
    switch (this.activeUploadStep) {
      case 1:
        if (this.Neg) {
          return 'נתוני החזר כספי';
        }
        else {
          return 'נתוני תהליך';
        }

      case 2:
        return 'טעינת נתונים';
      case 3:
        return 'הקובץ בטעינה';
    }
  }
  GetClassTitle() {
    return this.activeUploadStep !== 2 ? 'text-center' : 'ClassTitle';
  }
  openTransitionDialog(): void {
    this.processFileService.PrepareContactToSendMail(this.process.id, this.isPaymentTransferred).then((response) => {
      this.dialog.open(TransitionDialogComponent, {

        data: {
          isPaymentTransferred: this.isPaymentTransferred,
          process: this.process,
          Contact: response,
          text: this.isPaymentTransferred ? 'ישלח מייל עדכון על סיום טעינת הקובץ' : 'הנחיית התשלום תשלח למייל בסיום עיבוד הקובץ',
        },
        height: '450px',
        width: '600px'
      })
    });

  }

  KeepHaveNegativeProcess() {
    this.HaveNegativeProcess = true;
    this.processService.postKeepHaveNegativeProcess(this.process.id, this.HaveNegativeProcess);


  }
 
GetFileFromDrop(event){
  debugger;
    console.log(event);
    this.files = event.files;
    if (this.files == null || this.files.length === 0) {
      return;
    }
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) =>
          this.setFile(file));

      }
    }
}

  
  setFile(file: File) {
    debugger;
    if (this.paymentsFile) {
      return;
    }
    this.process.NegativeProcess = file.name.indexOf('EMPNEG') > -1;
    const ext = file.name.substr(file.name.indexOf('.') + 1);
    if (['xml', 'XML', 'dat', 'DAT'].indexOf(ext) === -1) {
      this.fileTypeError = true;
      return;
    }

    if (this.fileTypeError) {
      this.fileTypeError = false;
    }

    if (this.noFileError) {
      this.noFileError = false;
    }

    this.paymentsFile = file;
  }

  removeFile(): void {
    this.paymentsFile = null;
  }
  changeEmployer(id: number) {
    this.EmployerID = id;
    this.process.employer = this.employers.find(x => x.id == id);
  }
  setActiveUploadStep(nextStep: number, processForm: NgForm): void {
    if (this.EmployerID == -1) {
      return this.notificationService.showResult("בחר מעסיק ", "error");
    }
    if (nextStep === 2 && !processForm.valid) {
      return;
    }

    if (nextStep === 3) {
      if (!this.paymentsFile) {
        return;
      }

      const dialog = this.dialog.open(PaymentPromptComponent, {
        height: '350px',
        width: '750px'
      });

      this.paymentDialogSubscription = dialog.afterClosed().subscribe((message) => {

        this.spin = true;
        console.log("this.spin", this.spin);
        console.log("message", message);
        this.process.pay = message;
        this.isPaymentTransferred = message;
        this.processFileService.uploadFile(this.process, this.paymentsFile).then(response => {
          if (response['responseCode'] == 1) {
            this.notificationService.showResult(response['message'], "error");
            this.spin = false;
            return;
          }
          if (response['responseCode'] == 0) {
            this.notificationService.showResult(response['message'], "success");
            this.spin = false;
          }
          const processNumber = response['processNumber'];
          this.activeUploadStep = nextStep;
          this.process.id = processNumber;
          this.spin = false;
          if (processNumber) {
            this.activeUploadStep = nextStep;
            this.checkFileStatus(processNumber);
          } else {
            this.notificationService.showResult('', NotificationType.error);
          }
        });
      });
    }

    if (nextStep === 2) {
      this.activeUploadStep = nextStep;
    }
  }

  private checkFileStatus(processNumber: number): void {
    const checkStatus = new Promise<boolean>((resolve) => {
      const interval = setInterval(() => {
        this.processFileService.getFileUploadStatus(processNumber).then((response) => {
          if (!response) {
            this.notificationService.showResult(response['message'], NotificationType.error);
            return;
          }

          if (response['progressPercent'] === 100) {
            clearInterval(interval);
            resolve();
          }
        });
      }, 10000);
    });
    const url = (this.process.pay || this.process.NegativeProcess || this.process.NegativeProcess) ? 'transmission' : 'payment';

    console.log("url", url);
    console.log("this.process.NegativeProcess", this.process.NegativeProcess);
    console.log("this.process.id", this.process.id);
    checkStatus.then(() => this.router.navigate(['..', this.process.id, url], { relativeTo: this.route }));


  }

  ngOnDestroy() {
    if (this.paymentDialogSubscription) {
      this.paymentDialogSubscription.unsubscribe();
    }
  }

}
