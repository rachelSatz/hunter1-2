import {Component, OnInit, Inject} from '@angular/core';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  fileName: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private feedbackService: FeedbackService) { }

  ngOnInit() {
    console.log(this.data);
  }

  downloadFile() {
    console.log( 'sdf');

    this.feedbackService.downloadGroupThingFile(6).then(response => {
    });
  }
}
