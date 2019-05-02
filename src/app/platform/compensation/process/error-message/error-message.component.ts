import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CompensationService } from 'app/shared/_services/http/compensation.service';
import { Compensation, AnswerManufacturer } from 'app/shared/_models/compensation.model';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styles: ['.tableHeight { height: 200px; overflow-y: auto }', '.colorTh { color: #fff; background-color: #808080}'],
  animations: [ fade ]
})
export class ErrorMessageComponent implements OnInit {

  hasServerError: boolean;
  answer: any[];

  constructor(@Inject(MAT_DIALOG_DATA) public compensation: Compensation) {
    if (compensation.answering_manufacturer !== null &&
      compensation.answering_manufacturer !== '') {
      const lstAnswer = compensation.answering_manufacturer.split(',');
      this.answer = Object.keys(AnswerManufacturer).map(function (e) {
        if (lstAnswer.some(a => a === AnswerManufacturer[e])) {
          return e;
        }
      });
      this.answer = this.answer.filter(a =>   a !== undefined );
    }

  }

  ngOnInit() {


  }

  submit(): void {
    this.hasServerError = false;

  }

}
