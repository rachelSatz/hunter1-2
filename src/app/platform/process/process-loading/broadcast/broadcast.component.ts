import { Component, OnInit } from '@angular/core';
import { ProcessLoadingComponent } from 'app/platform/process/process-loading/process-loading.component';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.css']
})
export class BroadcastComponent implements OnInit {

  constructor(public processLoading: ProcessLoadingComponent,
              private processService: ProcessService,
              public processDataService: ProcessDataService,
              private selectUnit: SelectUnitService,
              private notificationService: NotificationService) { }

  ngOnInit() {
    if (this.processDataService.activeProcess === undefined) {
      this.processDataService = this.selectUnit.getProcessData();
    }
  }

  transfer() {
    this.processService.getCommentBroadcast(this.processLoading.process_details.employer_id).then(comment => {
      const buttons = {confirmButtonText: 'כן', cancelButtonText: 'לא'};
      if (comment === null) {comment = ''; }
      this.notificationService.warning('אשר שידור', comment , buttons).then(confirmation => {
        if (confirmation.value) {
          // this.processService.transfer(this.processLoading.process_details.id, 'processId')
          //   .then(response => {
          //     if (response.ok === false) {
          //       this.notificationService.error('', 'לא הצליח לשדר קובץ');
          //     } else {
          //       const button = {confirmButtonText: 'המשך'};
          //       this.notificationService.warning('הקובץ שודר לקופות בהצלחה' , '' , button).then(conf => {
          //         if (conf.value) {
                    this.processLoading.setPage(5, true);
        //           }
        //         });
        //
        //         }
        //     });
        }
      });
    });
  }
}
