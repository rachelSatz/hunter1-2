import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupSelectCampaignsComponent } from './group-select-campaigns/group-select-campaigns.component';
import { CampaignsSummaryComponent } from './campaigns-summary/campaigns-summary.component';
import { CampaignsTypeComponent } from './campaigns-type/campaigns-type.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {NotificationService} from '../../../shared/_services/notification.service';
import {RouterModule, Routes} from '@angular/router';
import {CampaignsFormComponent} from './campaigns-form.component';
import {DataTableModule} from '../../../shared/data-table/data-table.module';
import {BdSelectModule} from '../../../../assets/js/bd-select/bd-select.module';

const routes: Routes = [
  { path: '', component: CampaignsFormComponent }
];

@NgModule({
  declarations: [GroupSelectCampaignsComponent, CampaignsSummaryComponent, CampaignsTypeComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterModule.forChild(routes),
    DataTableModule,
    BdSelectModule,
  ],
  providers: [NotificationService],
  entryComponents: [CampaignsSummaryComponent, CampaignsTypeComponent, GroupSelectCampaignsComponent]
})
export class CampaignsFormModule { }
