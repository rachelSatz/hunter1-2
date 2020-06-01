import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatCheckboxChange, MatDialogRef } from '@angular/material';
import { fade } from 'app/shared/_animations/animation';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'app/shared/_services/notification.service';
import { Message } from 'app/shared/_models/message.model';
import { MessageService } from 'app/shared/_services/http/message.service';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styles: ['{ height: 200px; overflow-y: auto; padding-top: 20px }'],
  animations: [ fade ],
  styleUrls: ['./message-form.component.css']
})
export class MessageFormComponent implements OnInit {
  hasServerError: boolean;
  showForm1 = true;
  showForm2 = false;
  showForm3 = false;
  public files: any[] = [];
  fileTypeError = false;
  uploadedFile: File[];
  processFile: File[] = [];
  spin: boolean;
  message = new Message;
  showContent: boolean;
  isChecked = false;
  visibility = 'hidden';

  constructor(protected route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<MessageFormComponent>,
              private notificationService: NotificationService,
              private messageService: MessageService) { }



  ngOnInit() {
    if (this.data !== 'undefined' && this.data.id !== 'undefined') {
      this.message.title = this.data['data'].title;
      this.message.content = this.data['data'].content;
      this.message.created_at = this.data['data'].created_at;
      this.message.sent_at = this.data['data'].sent_at;
      this.message.name = this.data['data'].name;
      if (this.data['files'] !== 'undefined' && this.data['files'].length > 0) {
        this.processFile = this.data['files'];
      }
    } else {
      // this.message =
    }
  }

  submit(): void {
    this.hasServerError = false;
    if (this.data.length > 0 && this.data !== 'undefined' && this.data.id !== 'undefined') {
      this.messageService.update(this.message, this.processFile).then(response => this.handleResponse(response));
    } else {
      this.messageService.create(this.message, this.processFile).then(response => this.handleResponse(response));
    }
  }

  private handleResponse(response: string): void {
    if (response['message'] === 'success') {
      this.notificationService.success('נשמר בהצלחה');
    } else {
      this.notificationService.error(response);
    }
  }

  close() {
    this.dialogRef.close();
  }

  continue() {
    this.showForm2 = true;
    this.showForm1 = false;
  }

  back() {
    this.showForm1 = true;
    this.showForm2 = false;
  }

  back2() {
    this.showForm2 = true;
    this.showForm3 = false;
  }


  continue2() {
    this.showForm2 = false;
    this.showForm3 = true;
  }



  setFile(files: File[]) {
    for (let i = 0; i < files.length; i++) {
        this.processFile.push(files[i]);
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


  addEmail(checked: boolean) {
    if (checked) {
      // this.showContent = true;
      this.visibility = 'visible';
    } else {
      // this.showContent = false;
      this.visibility = 'hidden';
    }
  }
}

// this.messageService.getMessage(this.data.id).then(response => {
//   if (response) {
//     this.message = response;
//   } else {
//     this.hasServerError = true;
//   }
// });
