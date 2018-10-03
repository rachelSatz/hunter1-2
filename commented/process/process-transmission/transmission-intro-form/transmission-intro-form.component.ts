
import { Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { TransmissionData } from '../../../../shared/_models/transmission-data.model';
import { ProcessService } from "../../../../shared/_services/http/process.service";
import { Process } from "../../../../shared/_models/process.model";
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../../shared/_services/notification.service';
@Component({
  selector: 'app-transmission-intro-form',
  templateUrl: './transmission-intro-form.component.html'
})
export class TransmissionIntroFormComponent {
  data = new TransmissionData();
  date: string;
  public spin = false;

  constructor(@Inject(MAT_DIALOG_DATA) private process: Process,
   private route: ActivatedRoute,
   private dialogRef: MatDialogRef<TransmissionIntroFormComponent>,
  private processService: ProcessService,private notificationService:NotificationService) {}
 
  submit(isValid: boolean): void {
    if (isValid) {
      const date = new Date(this.date);

      const formattedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
      this.data.date = formattedDate;    
      this.launchTransmission(this.data);
        
    }
  }
  private launchTransmission(data: TransmissionData): void {
    this.spin = true;
    this.processService.launchTransmission(this.process.id, data).then(response => {
      if(response.responseCode==1){
        this.notificationService.showResult(response.message, "error")
        this.dialogRef.close();
        this.spin = false;
        return;
      }
      if(response.responseCode==0){
        this.notificationService.showResult(response.message, "success")
      }
  
      this.data = response['data'];
      this.dialogRef.close(this.data);
      this.spin = false;
     // this.initChecklist(response['data']);
    });
  }
  onCloseClicked(): void {
    this.dialogRef.close(false);
  }

}
