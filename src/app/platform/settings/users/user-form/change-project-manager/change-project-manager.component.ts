import { Component, Inject, OnInit } from '@angular/core';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UserService } from 'app/shared/_services/http/user.service';

@Component({
  selector: 'app-change-project-manager',
  templateUrl: './change-project-manager.component.html'
})
export class ChangeProjectManagerComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)  public data: any,
              private employerService: EmployerService,
              private userService: UserService,
              private  dialogRef: MatDialogRef<ChangeProjectManagerComponent>) { }
  operatorId = 0;
  operators = [];
  ngOnInit() {
    this.getOperator();
  }

  getOperator(): void {
    this.employerService.getOperator(false).then(response => {
      this.operators = response;
    });
  }

  submit(): void {
    if (this.data.userId !== this.operatorId) {
      this.userService.changeProjectManager(this.data.userId, this.operatorId,
        this.data.isCheckAll, this.data.items).then(response => {
        if (response) {
          this.close(response);
        }
      });
    }
  }

  close(response?): void {
    this.dialogRef.close(response);
  }

}
