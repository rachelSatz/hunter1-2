import { Component, OnInit } from '@angular/core';
import { EmployerComponent } from 'app/employer/employer.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { MONTHS } from 'app/shared/_const/months';
import { ProcessService } from 'app/shared/_services/http/process.service';

@Component({
  selector: 'app-broadcast-employer',
  templateUrl: './broadcast-employer.component.html',
  styleUrls: ['./broadcast-employer.component.css']
})
export class BroadcastEmployerComponent implements OnInit {

  constructor( public employerComponent: EmployerComponent,
               protected notificationService: NotificationService,
               private processService: ProcessService,
               public processDataService: ProcessDataService,
               private selectUnit: SelectUnitService) { }

  months = MONTHS;


  ngOnInit() {
    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnit.getProcessData();
    }
  }

  submit(): void {
      this.processService.transfer_new(this.employerComponent.process_details.id)
        .then(response => {
          if (response.ok === false) {
            if (response.status === 400) {
               this.notificationService.error('', 'לא ניתן לשדר קובץ פעמים');
            } else {
              this.notificationService.error('', 'לא הצליח לשדר קובץ');
            }
          } else {
             this.notificationService.success(
              'הקובץ שודר לקופות בהצלחה', 'נמשיך לעדכנך בפרטים בהמשך!',
              {allowOutsideClick: false,
                showConfirmButton: false});
          }
        });
  }

  openRow(): void {

  }

}
