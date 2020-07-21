import { Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EmployerService } from '../../../../shared/_services/http/employer.service';
import { GroupService } from '../../../../shared/_services/http/group.service';


@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html'
})
export class GroupDetailsComponent implements OnInit {

  groupName: string;
  employers = [];
  error = false;
  select = false;
  create = false;
  group;
  groups;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<GroupDetailsComponent>,
    public employerService: EmployerService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    if (this.data.mode === 'create') {
      this.create = true;
    } else {
      this.select = true;
      this.groupService.getGroupsName().then( response => this.groups = response);
    }
    this.data.employers.forEach( employer => {
      this.employers.push(employer.id);
    });
  }

  submit() {
    if (this.create) {
      this.groupService.createGroup(this.groupName, this.employers, this.data.isCheckAll).then( response => {
          if (response['result'] === 'success') {
            this.dialogRef.close('success');
          } else if (response['result'] === 'error') {
            this.dialogRef.close('error');
          } else {
            this.error = true;
          }
        });
    } else {
      this.groupService.addToGroup(this.group, this.employers, this.data.isCheckAll).then( response => {
          if (response['result'] === 'success') {
            this.dialogRef.close('success');
          } else {
            this.dialogRef.close('error');
          }
        });
    }
  }

}
