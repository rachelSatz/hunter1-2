import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, Validators} from '@angular/forms';
import { Subscription} from 'rxjs';
import { fade } from 'app/shared/_animations/animation';
import { HelpersService} from '../../../shared/_services/helpers.service';
import { CampaignsService} from '../../../shared/_services/http/campains.service';
import {ActivatedRoute, Router} from '@angular/router';
import { NotificationService} from '../../../shared/_services/notification.service';
import { DatePipe} from '@angular/common';
import {SelectUnitService} from '../../../shared/_services/select-unit.service';
import {TaskCampaignService} from '../../../shared/_services/campaign-data-service';


@Component({
  selector: 'app-campaigns-form',
  templateUrl: './campaigns-form.component.html',
  styleUrls: ['./campaigns-form.component.css'],
  animations: [ fade]
})
export class CampaignsFormComponent implements OnInit {
  sub = new Subscription;
  tab: number;
  request = { submitFailed: false, submitSuccessfully: false };
  type;

  constructor(
    public router: Router,
    public campaignsService: CampaignsService,
    public helpers: HelpersService,
    public selectUnitService: SelectUnitService,
    public notification: NotificationService,
    public route: ActivatedRoute,
  ) { }

  id = 0;
  status = null;

  changeStatusCampaign() {
    this.id = this.selectUnitService.getTaskCampaign() ? this.selectUnitService.getTaskCampaign().activeCampaigns.details.id : 0;
    this.status = this.selectUnitService.getTaskCampaign() ? this.selectUnitService.getTaskCampaign().activeCampaigns.details.status : null;
    if (this.status !== 'done') {
      const stat = this.status === 'no_active' ? 'in_process' : 'no_active';
      this.campaignsService.changeStatus(this.id, stat).then(response => {
        if (response) {
          this.router.navigate(['/platform', 'operator', 'campaigns']);
        } else {
          this.notification.error('העידכון נכשל');
        }
      } );
    } else {
      this.notification.error('הקמפיין כבר הסתיים');
    }
  }

  ngOnInit() {
    this.tab = 1;
  }

  setHeaderColor(): number {
    const currentRoute = (this.router.url).split('/');
    if (currentRoute[5]) {
      if (currentRoute[5].includes('send')) {
        return 3;
      } else {
        return 2;
      }
    }
    return 1;
  }


}
