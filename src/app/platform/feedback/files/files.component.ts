import { Component, OnInit } from '@angular/core';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'app/shared/_services/notification.service';
import { MatDialog } from '@angular/material';
import { FormComponent } from './form/form.component';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { InquiryFormComponent} from '../shared/inquiry-form/inquiry-form.component';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class FilesComponent extends DataTableComponent implements OnInit {


  readonly headers: DataTableHeader[] = [
    {column: 'company_name', label: 'חברה מנהלת'},
    // {column: 'month', label: 'חודש שכר'},
    {column: 'amount', label: 'סכום'},
    {column: 'code', label: 'קוד אוצר'},
    // {column: 'date', label: 'תאריך שידור'},
    {column: 'inquiry_created_at', label: 'תאריך יצירת הפנייה'},
    {column: 'last_update', label: 'תאריך עדכון אחרון'},
    {column: 'status', label: 'סטטוס'},
    // {column: 'inquiry_status', label: 'סטטוס פנייה'},
    {column: 'more', label: 'מידע נוסף'},
    {column: 'send_request', label: 'שלח פנייה'},
    {column: 'comments', label: 'הערות'}

  ];

  constructor(route: ActivatedRoute, private router: Router,
              protected notificationService: NotificationService,
              private dialog: MatDialog, private feedbackService: FeedbackService,
              private selectUnit: SelectUnitService) {
    super(route, notificationService);
  }

  ngOnInit() {
    this.feedbackService.getFileFeedbacks(this.selectUnit.currentDepartmentID).then(response => this.setItems(response));
  }

  openFormDialog(): void {
    this.dialog.open(FormComponent, {
      width: '550px',
      panelClass: 'dialog-file'
    });
  }

  openDialog(): void {
    this.dialog.open(InquiryFormComponent, {
      data: {'id': 1, 'contentType': 'groupthing', 'employerId': 4, 'companyId': 5},
      width: '550px',
      panelClass: 'dialog-file'
    });
  }
}
