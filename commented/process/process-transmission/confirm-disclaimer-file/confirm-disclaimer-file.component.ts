import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Process } from "../../../../shared/_models/process.model";
import { Manufacturer } from "../../../../shared/_models/manufacturer.model";
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { ProcessService } from "../../../../shared/_services/http/process.service";
import { NotificationService } from "../../../../shared/_services/notification.service";
// declare const SignaturePad: any;

@Component({
  selector: 'app-confirm-disclaimer-file',
  templateUrl: './confirm-disclaimer-file.component.html',
  styleUrls: ['./confirm-disclaimer-file.component.css']
})
export class ConfirmDisclaimerFileComponent implements OnInit {
  signature: string;
  hasSingature: boolean = false;
  boolsendTosafeBox: boolean = false;
  isValid:boolean=true;
  public Send: boolean = false;
  public spin = false;
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;


  signaturePadOptions: Object = {
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300
  };
  process: Process;
  manufacturers: Manufacturer[];
  today: number = Date.now();
  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private processService: ProcessService,
    private dialogRef: MatDialogRef<ConfirmDisclaimerFileComponent>, private notificationService: NotificationService) {
    this.process = data.fileUplode;
    this.manufacturers = data.manufacturers;
  }
  ngAfterViewInit() {
    this.signaturePad.set('canvasWidth', 1110);
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API*/

  }
  ngOnInit() {
    console.log(this.manufacturers);
    console.log(this.process);

  }
  signatureComplete(): void {
    this.signature = this.signaturePad.toDataURL();
    this.hasSingature = true;
  }

  signatureClear(): void {
    this.signaturePad.clear();
    this.hasSingature = false;
  }

  sendTosafeBox() {
    console.log("hasSingature",this.hasSingature);
    
    if (!this.hasSingature) {
      this.boolsendTosafeBox = true;
      return;
    }
    else {
      this.boolsendTosafeBox = false;
      this.isValid = false;

 
      this.spin = true;
      console.log("signature", this.signature);
      
      this.processService.postTransition(this.process,null, this.signature)
        .then(response => {
          this.spin = false;
          if (response.Success == 0) {
            this.Send = true;
            sessionStorage.setItem('Send' + this.process.id, this.Send.toString());
          }

         this.spin = false;
        this.notificationService.showResult(response.Message, response.Success == "1" ? "error" : "success");
     
      this.dialogRef.close(this.Send);
     this.isValid = true;



        });

    }
  }

}
