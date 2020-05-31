import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'app/shared/_services/notification.service';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { MessageService } from 'app/shared/_services/http/message.service';
import { MatDialog } from '@angular/material';
import { MessageFormComponent } from 'app/platform/operator/messages/message-form/message-form.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTable: DataTableComponent;

  msgs: any;
  files: any;
  selectedFiles: any;

  constructor(private router: Router,
              protected route: ActivatedRoute,
              protected notificationService: NotificationService,
              public messageService: MessageService,
              private dialog: MatDialog) { }

  readonly columns =  [
    { name: 'name', label: 'שם הודעה', searchable: false},
    { name: 'created_at', label: 'נוצר בתאריך', searchable: false},
    { name: 'sent_at', label: 'נשלח בתאריך' , searchable: false},
    // { name: 'actions', label: 'פעולות' , searchable: false}
  ];

  ngOnInit() {
    this.dataTable.placeHolderSearch = 'חיפוש';
    this.fetchItems();
  }


  fetchItems() {
    this.messageService.getMessages(this.dataTable.criteria).then(response => {
      this.dataTable.setItems(response);
      this.msgs = response;
      this.files = response['files'];
    });
  }

  openMessageDialog(item?: any): void {
    this.selectedFiles = this.files.filter(a => a.id === +item.id);

    const dialog = this.dialog.open(MessageFormComponent, {
      data: {data: item, files: this.selectedFiles},
      width: '650px',
      height: '500px'
    });
  }


  removeMessage(id): void {
    this.messageService.delete(id).then(response => {
      if (response) {
        this.notificationService.success('המחיקה התבצעה בהצלחה.');
      } else {
        this.notificationService.success('אירעה שגיאה.');
      }
    });
  }

  sendMessage(item?: any): void {
    this.messageService.send(item).then(response => {
      if (response['result'] === 'ok') {
        this.notificationService.success('השליחה התבצעה בהצלחה.');
      } else {
        this.notificationService.success('אירעה שגיאה.');
      }
    });
  }

}
