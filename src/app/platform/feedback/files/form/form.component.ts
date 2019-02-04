import {Component, OnInit, Inject} from '@angular/core';
import { FeedbackService } from 'app/shared/_services/http/feedback.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  fileName: string;
  constructor(private feedbackService: FeedbackService) { }

  ngOnInit() {
  }

  downloadFile() {
    console.log( 'sdf');

    this.feedbackService.downloadGroupThingFile(6).then(response => {
    });
  }
}
