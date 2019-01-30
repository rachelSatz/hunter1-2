import { Component, OnInit } from '@angular/core';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'app/shared/_services/notification.service';
import { MatDialog } from '@angular/material';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['../../../shared/data-table/data-table.component.css']
})
export class FilesComponent extends DataTableComponent implements OnInit {

  readonly headers: DataTableHeader[] =  [
    { column: 'company_name', label: 'חברה מנהלת' },
    { column: 'employer_name', label: 'שם מעסיק' },
    { column: 'process_name', label: 'שם תהליך' },
    { column: 'month', label: 'חודש שכר' },
    { column: 'amount', label: 'סכום' },
    { column: 'code', label: 'קוד אוצר' },
    { column: 'date', label: 'תאריך שידור' },
    { column: 'amount', label: 'תאריך יצירת הפנייה' },
    { column: 'status', label: 'תאריך עדכון אחרון' },
    { column: 'download', label: 'היזון ראשוני' },
    { column: 'amount', label: 'היזון חודשי' },
    { column: 'status', label: 'סטטוס' },
    { column: 'download', label: 'סטטוס פנייה' }
  ];

  constructor(route: ActivatedRoute, private router: Router,
              protected notificationService: NotificationService,
              private dialog: MatDialog) {
    super(route, notificationService);
  }

  ngOnInit() {
  }

  openFormDialog(): void {
    this.dialog.open(FormComponent, {
      width: '550px',
      panelClass: 'dialog-file'
    });
  }
}
