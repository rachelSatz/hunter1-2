import { Component, OnInit } from '@angular/core';

import { EmployerService } from 'app/shared/_services/http/employer.service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { ActivatedRoute } from '@angular/router';
import { Employer } from 'app/shared/_models/employer.model';
import { AddEmailComponent } from './add-email/add-email.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  process_type = [
    {name: 'האם לטעון קובץ', title: 'הוספת מייל לקבלת הקובץ', process_type: 'upload_file',
      column: 'process_upload_auto'},
    {name: 'האם ליצר המלצת תשלום', title: 'הוספת מייל לשליחת הנחיות לתשלום', process_type: 'payment_instructions',
      column: 'send_payment_instructions_auto'},
    {name: 'האם לאשר אסמכתאות', title: 'הוספת מייל לאישור אסמכתא', process_type: 'upload_reference', column: 'references_auto'},
    {name: 'האם לשדר לקופות', title: 'הוספת מייל לאישור שידור', process_type: 'transmit_file', column: 'transmission_product_auto'},
    {name: 'האם לאשר צפיה בהיזונים', title: 'הוספת מייל לצפיה בהיזונים', process_type: 'feedback', column: 'feedback_auto'}
    ] ;

  a = ['no_remainder', 'link', 'remainder'];
  month = [];
  type = 'report';
  role = this.userSession.getRole() !== 'employer';
  employer: Employer;


  constructor( private route: ActivatedRoute,
               private employerService: EmployerService,
               private selectUnit: SelectUnitService,
               private dialog: MatDialog,
               private userSession: UserSessionService,
               protected notificationService: NotificationService) { }

  ngOnInit() {
    for (let i = 0; i < 31; i++) {
      this.month[i] = i + 1;
    }
    this.employer = this.route.parent.snapshot.parent.data['employer'];
  }

  addEmailToEmployer(process_type): void {
    this.dialog.open(AddEmailComponent, {
      data : {employerId : this.employer.id, process_type: process_type},
      width: '550px',
      height: '500px'
    });

  }
  ChangeRemainder(value, column, type): void {
    if (value.checked === true) {
      this.employer[column] = type;
      // console.log({ checked: true, product_id: product_id});
    } else {
      this.employer[column] = 'no_remainder';
    }
  }

  submit(form) {
    this.employerService.updateMonthlyReports(form.value, this.selectUnit.currentEmployerID, this.employer).then( response => {
      if ( response === 'Success') {
        this.notificationService.success('נשמר בהצלחה');
      }else {
        this.notificationService.success( 'שגיאה');
      }
    });
  }
}
