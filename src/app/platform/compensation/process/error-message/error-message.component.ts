import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { CompensationService } from 'app/shared/_services/http/compensation.service';
import {Compensation, AnswerManufacturer} from 'app/shared/_models/compensation.model';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styles: ['.tableHeight { height: 200px; overflow-y: auto }', '.colorTh { color: #fff; background-color: #808080}'],
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        opacity: '0'
      })),
      state('active', style({
        display: '*',
        opacity: '1'
      })),
      transition('active => inactive', animate('0ms')),
      transition('inactive => active', animate('200ms'))
    ])
  ]
})
export class ErrorMessageComponent implements OnInit {

  hasServerError: boolean;
  answer: any[];

  constructor(@Inject(MAT_DIALOG_DATA) public compensation: Compensation,
              private dialogRef: MatDialogRef<ErrorMessageComponent>, private compensationService: CompensationService) {
    if (compensation.answerings_manufacturer !== null &&
      compensation.answerings_manufacturer !== '') {
      const lstAnswer = compensation.answerings_manufacturer.split(',');
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
