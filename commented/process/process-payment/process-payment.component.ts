import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProcessService } from '../../../shared/_services/http/process.service';
import { ProcessMethodService } from '../../../shared/_services/http/process-method.service';
import { NotificationService, NotificationType } from '../../../shared/_services/notification.service';

import { Process } from '../../../shared/_models/process.model';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-process-payment',
  templateUrl: './process-payment.component.html',
  styleUrls: ['./process-payment.component.css'],
  providers: [ProcessService, ProcessMethodService, NotificationService]
})
export class ProcessPaymentComponent implements OnInit {

  process: Process;
  paymentOption: 'downloadExcel' | 'downloadMasab' | 'mailMasab';
  spin:boolean=false;
  showPaymentOptions = false;

  constructor(protected route: ActivatedRoute, private processService: ProcessService,private router: Router,
    private processMethodService: ProcessMethodService, private notificationService: NotificationService) {
  
     }

  ngOnInit() {
    this.process = this.route.parent.snapshot.data['process'].data.process;

    this.processService.getProcessDetail(this.process.id).then(
      response => this.process.details = response
    );
  }
  ContinueToPay(){
    console.log("ContinueToPay");
    
     const url = 'transmission' ;
      console.log("ContinueToPay",url);
        this.router.navigate(['/process', 'new', this.process.id, url]);
  }
 GetrouterLink(){
  this.showPaymentOptions = !this.showPaymentOptions
  }
  downloadExcel(): void {
    this.paymentOption = 'downloadExcel';
    this.spin=true;
    this.processMethodService.downloadExcel(this.process.id)
      .then(response => 
        {
          const date = new Date();
          const filename = "paytransfer-" + String(date.getFullYear()) + String(date.getMonth() + 1) + String(date.getMilliseconds()) + '.xls';
        FileSaver.saveAs(response, filename);
        this.spin=false;
        })
      .catch(res => {
         this.spin=false;
        this.notificationService.showResult(res.error.Message, NotificationType.error);
      });

  }

  downloadMasab(): void {
    this.spin=true;
    this.paymentOption = 'downloadMasab';
    this.processMethodService.downloadMasab(this.process.id)
      .then(response => {
        const date = new Date();
        const filename = "msv-" + String(date.getFullYear()) + String(date.getMonth() + 1) + String(date.getMilliseconds()) + '.001';
        FileSaver.saveAs(response, filename);
        this.spin=false;
      })
      .catch(res => {
          this.spin=false;
        this.notificationService.showResult(res.error.Message, NotificationType.error);
      });

  }
SentMailMoveMent(){
  this.spin=true;
 this.paymentOption = 'mailMasab';
    this.processMethodService.mailMasab(this.process.id).then(response =>{
      this.spin=false;
        this.notificationService.showResult(response.toString(), NotificationType.success)
    } )
      .catch(res => {
         this.spin=false;
        this.notificationService.showResult(res.error.Message, NotificationType.error);
      });
      
     
}
}
