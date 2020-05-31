import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from '../../shared/data-table/data-table.module';
import { BdSelectModule } from '../../../assets/js/bd-select/bd-select.module';
import { NotificationService } from '../../shared/_services/notification.service';
import { CampaignsComponent } from './campaigns.component';
import { GroupService } from '../../shared/_services/http/group.service';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: CampaignsComponent },
  { path: 'campaigns-form', loadChildren: 'app/platform/campaigns/campaigns-form/campaigns-form.module#CampaignsFormModule'}
];

@NgModule({
  declarations: [CampaignsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule,
    BdSelectModule,
    ReactiveFormsModule,
  ],
  providers: [NotificationService, GroupService],
})
export class CampaignsModule { }
