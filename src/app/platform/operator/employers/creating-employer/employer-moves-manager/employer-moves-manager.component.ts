import {Component, Inject, OnInit} from '@angular/core';
import {ProcessService} from '../../../../../shared/_services/http/process.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {EmployerService} from '../../../../../shared/_services/http/employer.service';

@Component({
  selector: 'app-employer-moves-manager',
  templateUrl: './employer-moves-manager.component.html',
  styleUrls: ['./employer-moves-manager.component.css']
})
export class EmployerMovesManagerComponent implements OnInit {

  comment: string;
  date: any;
  operators = [];
  operatorId: number;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<EmployerMovesManagerComponent>,
              private employerService: EmployerService) { }

  ngOnInit() {
    this.operatorId = this.data.operatorId;
    this.employerService.getOperator().then(response => {
      this.operators = response;
    });
  }

  send(): void {
    const data = {
      operatorId: this.operatorId,
      comment: this.comment
    };
     this.dialogRef.close(data);
  }

  cancel(): void {
    this.dialogRef.close('cancel');
  }

}
