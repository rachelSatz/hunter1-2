import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData} from '../employees.component';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { Month } from 'app/shared/_const/month-bd-select';

@Component({
  selector: 'app-send-application',
  templateUrl: './send-application.component.html',
  styleUrls: ['./send-application.component.css'],
  providers: [GeneralHttpService]
})
export class SendApplicationComponent implements OnInit {
  commentContent: string;
  months = Month;
  monthSearch;

  readonly years = [2016, 2017, 2018, 2019];

  constructor(public dialogRef: MatDialogRef<SendApplicationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private generalHttpService: GeneralHttpService) {}

  ngOnInit() {
  }

  newComment() {
    this.generalHttpService.newComment(15, this.commentContent, 'string');
  }
}
