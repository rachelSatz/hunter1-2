import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { CompensationService } from 'app/shared/_services/http/compensation.service';

@Component({
  selector: 'app-inquiries',
  templateUrl: './inquiries.component.html'
})
export class InquiriesComponent implements OnInit {

  inquiries = [];

  constructor(@Inject(MAT_DIALOG_DATA) public compensationID: number, private dialog: MatDialog,
              private compensationService: CompensationService) {}

  ngOnInit() {
    this.compensationService.getInquiries(this.compensationID).then(response => this.inquiries = response);
  }

}
