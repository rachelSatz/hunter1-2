import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-group-members-dialog',
  templateUrl: './group-members-dialog.component.html',
  styleUrls: ['./group-members-dialog.component.css']
})
export class GroupMembersDialogComponent implements OnInit {
  items;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.items = this.data.items;
  }

}
