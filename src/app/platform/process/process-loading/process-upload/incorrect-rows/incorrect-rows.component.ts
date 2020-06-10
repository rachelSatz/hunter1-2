import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProcessDetails } from 'app/shared/_models/process-details.model';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { Subscription } from 'rxjs';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-incorrect-rows',
  templateUrl: './incorrect-rows.component.html',
  styleUrls: ['./incorrect-rows.component.css']
})
export class IncorrectRowsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public process_details: ProcessDetails,
              private dialogRef: MatDialogRef<IncorrectRowsComponent>,
              private selectUnit: SelectUnitService) { }
  sub = new Subscription;

  ngOnInit() {
    this.selectUnit.setCountIncorrectRows(this.process_details.count);
  }

  setPage(): void {
    let location = '';
    if (environment.apiUrl.includes('8000/api')) {
      location = 'http://localhost:4200/records';
    } else {
      location = 'http://212.29.236.40/records';
    }
     window.open(location, '_blank', 'location=yes,scrollbars=yes,status=yes');
  }

  @HostListener('window:storage', ['$event'])
  changeSessionStorage(event) {
    this.process_details.count = this.selectUnit.getCountIncorrectRows();
    if (this.process_details.count === 0) {
      this.dialogRef.close();
    }
    return false;
  }
}
