import { Component, OnInit } from '@angular/core';
import {CampaignsService} from '../../../../shared/_services/http/campains.service';
import {CampaignsFieldStatus, CampaignsStatus, CampaignsSubType, CampaignsType, SentTypeStatus} from '../../../../shared/_models/campaigns';


@Component({
  selector: 'app-campaigns-type',
  templateUrl: './campaigns-type.component.html',
  styleUrls: ['./campaigns-type.component.css']
})
export class CampaignsTypeComponent implements OnInit {

  subtype;
  type = new CampaignsSubType();
  campaignsType = [];
  campaignsSubtype = [];
  status;
  statusSent;
  statuses = Object.keys(CampaignsFieldStatus).map(function(e) {
    return { id: e, name: CampaignsFieldStatus[e] };
  });
  statusesSent = Object.keys(SentTypeStatus).map(function(e) {
    return { id: e, name: SentTypeStatus[e] };
  });
  constructor(public campaignsService: CampaignsService) { }

  ngOnInit() {
    this.campaignsService.getTypes().then(response => this.campaignsType = response);
  }

  getSubtype() {
    this.campaignsSubtype = [];
    this.campaignsSubtype = this.campaignsType.find(a => a.id === this.type.type.id || a.id === this.type.type.type).subtype;
  }
}
