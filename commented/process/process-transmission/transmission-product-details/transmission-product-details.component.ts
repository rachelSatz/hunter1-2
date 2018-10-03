import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material';

import { ProcessService } from '../../../../shared/_services/http/process.service';
import { details } from '../../../../shared/_models/details.model';
import { productTypeLabel } from "../../../../shared/_const/EnumLabels";

@Component({
  selector: 'app-transmission-product-details',
  templateUrl: './transmission-product-details.component.html',
  styleUrls: ['./transmission-product-details.component.css']
})
export class TransmissionProductDetailsComponent implements OnInit {

  details: details[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public paymentID: number, private processService: ProcessService) {}

  ngOnInit() {
    this.processService.getTransmissionFileDetails(this.paymentID).then(response => this.details = response);
  }
 getproductTypeLabel(key: number): string {
    return productTypeLabel.get(key);
  }
}
