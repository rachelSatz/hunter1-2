import {Component, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-campaigns-summary',
  templateUrl: './campaigns-summary.component.html',
  styleUrls: ['./campaigns-summary.component.css']
})
export class CampaignsSummaryComponent implements OnInit {
  // @Input() campaignForm: FormGroup;
  // @Input() form: NgForm;
  @Input() tab: number;
  @Input() createdAt: string;
  @Input() request = { submitFailed: false, submitSuccessfully: false };
  // @Output() tabChange = new EventEmitter<number>();

  campaign: Object;

  constructor() {
  }

  ngOnInit() {
    // this.campaign = this.campaignForm;
  }


}
