import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ProcessDetails } from 'app/shared/_models/process-details.model';

@Component({
  selector: 'app-incorrect-rows',
  templateUrl: './incorrect-rows.component.html',
  styleUrls: ['./incorrect-rows.component.css']
})
export class IncorrectRowsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public process_details: ProcessDetails) { }

  ngOnInit() {
  }

  setPage(): void {
    const location = 'http://localhost:4200/platform/process/new/update/records';
    window.open(location, '_blank');
  }

}
