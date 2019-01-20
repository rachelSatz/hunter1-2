import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatButton } from '@angular/material';
import { NgForm } from '@angular/forms';
import { MonthlyTransferBlockService } from 'app/shared/_services/http/monthly-transfer-block';

@Component({
  selector: 'app-group-transfer',
  templateUrl: './group-transfer.component.html'
})
export class GroupTransferComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<GroupTransferComponent>,
              public mtbService: MonthlyTransferBlockService) { }

  groups: any;
  groupId: number;
  isShow = false;

  ngOnInit() {
    this.mtbService.groupList().then(items => {
      this.groups = items;
    });
  }
  // selectedGroup(): void {
  //   const selectedGroupId = this.groups.find(group => {
  //     return +group.id === this.groupId;
  //   });
  //
  // }
  showDiv(show: boolean): void {
    this.isShow = !show;
  }
  newGroup(): void {
    this.dialogRef.close();
    this.mtbService.createMTBGroup(this.data.ids).then( response => {
      if (response['success'] && response['message'] === 'diff') {
        this.dialogRef.close(response['data']);
      } else {
        this.dialogRef.close();
      }
    });
  }

  submit(form: NgForm): void {
    if (this.groupId > 0) {
      this.mtbService.updateMTBGroup(this.data.ids, this.groupId).then( response => {
        if (response) {
          this.dialogRef.close();
        }
      });
    } else {

    }


  }
}
