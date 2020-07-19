import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { MONTHS } from 'app/shared/_const/months';
import { EmployerComponent } from 'app/employer/employer.component';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { NotificationService } from 'app/shared/_services/notification.service';

@Component({
  selector: 'app-reference-employer',
  templateUrl: './reference-employer.component.html',
  styleUrls: ['./reference-employer.component.css']
})
export class ReferenceEmployerComponent implements OnInit {

  constructor(protected notificationService: NotificationService,
              public employerComponent: EmployerComponent,
              public processDataService: ProcessDataService,
              private selectUnit: SelectUnitService,
              public datePipe: DatePipe,
              private processService: ProcessService) { }

  files = [];
  months = MONTHS;
  date: any;
  valid: false;
  is_save_date: boolean;
  is_upload_ref: boolean;
  today = new Date().toJSON().split('T')[0];


  ngOnInit() {
    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnit.getProcessData();
    }

  }

  getFileFromDrop(event) {
    if (event.files != null && event.files.length > 0) {
      for (const droppedFile of event.files) {
        if (droppedFile['fileEntry'].isFile) {
          const fileEntry = droppedFile['fileEntry'] as any;
          fileEntry.file((file: File) => this.setFile([file]));
        }
      }
    }
  }

  setFile(files: File[]) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files[0]);
    }
  }

  confirmPayment(): void {
    if (this.valid) {
      if (this.files.length > 0) {
        this.processService.uploadsRef(this.files,
          this.employerComponent.process_details.id).then(response => {
          if (response['message'] === 'success') {
            this.is_upload_ref = true;
            this.notificationService.success('הקובץ עלה בהצלחה');
            this.checkIfContinueBroadcasting();
          } else {
            this.notificationService.error('ארעה שגיאה');
          }
        });
      } else {
        this.notificationService.warning('לא נבחר קובץ');
      }
    } else {
      this.notificationService.warning('עליך לאשר פרטי תשלום');
    }
  }

  save(): void {
    const dateFormat = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.processService.updateDate('date', dateFormat, null,
      null, this.processDataService.activeProcess.processID,
      null).then(res => {
      if (res) {
        this.is_save_date = true;
        this.notificationService.success('התאריך התעדכן בהצלחה');
        this.checkIfContinueBroadcasting();
      }
    });
  }

  continueBroadcasting(): void {
    this.employerComponent.setPage(4);
  }

  checkIfContinueBroadcasting(): void {
    if (this.is_save_date && this.is_upload_ref && !this.employerComponent.process_details.is_allowed_transmission_product_auto) {
      this.notificationService.success(
        'הקובץ בתהליך', 'נמשיך לעדכנך בפרטים בהמשך!',
        {allowOutsideClick: false,
          showConfirmButton: false});
    }
  }

  openRow(): void {

  }

}
