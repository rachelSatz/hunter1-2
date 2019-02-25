import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';
import { fade } from 'app/shared/_animations/animation';


@Component({
  selector: 'app-group-transfer',
  templateUrl: './group-transfer.component.html',
  animations: [ fade ]
})
export class GroupTransferComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<GroupTransferComponent>,
              public mtbService: MonthlyTransferBlockService) { }

  groupId: number;
  hasServerError: boolean;
  message: string;

  ngOnInit() {
  }

  newGroup(): void {
    this.hasServerError = false;
    this.mtbService.createMTBGroup(this.data.ids).then( response => {
      if (response['success'] && response['message'] === 'diff') {
        this.dialogRef.close(response['data']);
      } else {
        if (response['message'] === 'different products') {
          this.hasServerError = true;
          this.message = 'אין אפשרות להעביר לקבוצה שתי מ"ה שונים';
        }else {
          this.dialogRef.close();
        }
      }
    });
  }

  submit(form: NgForm): void {
    if (form.value.groupId > 0) {
      this.mtbService.createMTBGroup(this.data.ids, 0 , form.value.groupId, this.data.processId).then( response => {
        if (response) {
          this.dialogRef.close();
        }
      });
    }
  }
}
