import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DataTableModule} from '../../shared/data-table/data-table.module';
import {BdSelectModule} from '../../../assets/js/bd-select/bd-select.module';
import {NotificationService} from '../../shared/_services/notification.service';
import {CampaignsComponent} from './campaigns.component';
import {GroupService} from '../../shared/_services/http/group.service';
import { CampaignsFormComponent } from './campaigns-form/campaigns-form.component';


const routes: Routes = [
  { path: '', component: CampaignsComponent },
  { path: 'campaigns-form', component: CampaignsFormComponent}
];

@NgModule({
  declarations: [CampaignsComponent, CampaignsFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule,
    BdSelectModule
  ],
  providers: [NotificationService, GroupService],
  entryComponents: [CampaignsFormComponent]
})
export class CampaignsModule { }
