import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NotificationService } from '../../../shared/_services/notification.service';
import { RouterModule, Routes } from '@angular/router';
import { CampaignsFormComponent } from './campaigns-form.component';
import { DataTableModule } from '../../../shared/data-table/data-table.module';
import { BdSelectModule } from '../../../../assets/js/bd-select/bd-select.module';
import { CampaignsService } from '../../../shared/_services/http/campains.service';
import { MatRadioModule } from '@angular/material/radio';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {TaskCampaignService} from '../../../shared/_services/campaign-data-service';


const routes: Routes = [
  { path: '', component: CampaignsFormComponent ,  children: [
      { path: '', loadChildren: 'app/platform/campaigns/campaigns-form/campaigns-type/campaigns-type.module#CampaignsTypeModule' },
      { path: 'groups', loadChildren:
          'app/platform/campaigns/campaigns-form/group-select-campaigns/group-select-campaigns.module#GroupSelectCampaignsModule' },
    ]}
];

@NgModule({
  declarations: [CampaignsFormComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterModule.forChild(routes),
    DataTableModule,
    BdSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatDatepickerModule,
  ],
  providers: [
    NotificationService,
    CampaignsService,
    TaskCampaignService,
    FormBuilder
  ],
})

export class CampaignsFormModule { }
