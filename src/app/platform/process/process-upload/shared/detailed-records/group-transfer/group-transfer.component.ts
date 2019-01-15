import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProcessService } from 'app/shared/_services/http/process.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-group-transfer',
  templateUrl: './group-transfer.component.html'
})
export class GroupTransferComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<GroupTransferComponent>,
              public processService: ProcessService) { }

  groups: any;
  groupId: number;
  isShow = false;

  ngOnInit() {
    this.processService.groupList().then(items => {
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

  submit(form: NgForm): void {
    this.processService.updateMTBGroup(this.data.ids, this.groupId).then( response => {
      if (response) {
        this.dialogRef.close();
      }
    });
  }
}
