import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'app/shared/_services/notification.service';
import { EmployerComponent } from 'app/employer/employer.component';
import { ProcessService } from 'app/shared/_services/http/process.service';

@Component({
  selector: 'app-reference-employer',
  templateUrl: './reference-employer.component.html',
  styleUrls: ['./reference-employer.component.css']
})
export class ReferenceEmployerComponent implements OnInit {

  constructor(protected notificationService: NotificationService,
              public employerComponent: EmployerComponent,
              private processService: ProcessService) { }

  files = [];

  ngOnInit() {
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

  submit(): void {
    if (this.files.length > 0) {
      this.processService.uploadsRef(this.files,
        this.employerComponent.process_details.id ).then(response => {
        if (response['message'] === 'success') {
          this.notificationService.success( 'הקובץ עלה בהצלחה');
          ;
        } else {
          this.notificationService.error( 'ארעה שגיאה');
        }
      });
    } else {
      this.notificationService.warning( 'לא נבחר קובץ');
    }
  }

}
