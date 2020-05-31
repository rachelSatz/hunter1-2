import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BdSelectModule} from '../../../../../assets/js/bd-select/bd-select.module';
import { MatRadioModule} from '@angular/material/radio';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule} from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { GroupSelectCampaignsComponent} from './group-select-campaigns.component';
import { DataTableModule} from '../../../../shared/data-table/data-table.module';
import { GroupService} from '../../../../shared/_services/http/group.service';
import {TaskCampaignService} from '../../../../shared/_services/campaign-data-service';

const routes: Routes = [
  { path: '', component: GroupSelectCampaignsComponent }
];

@NgModule({
  declarations: [GroupSelectCampaignsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    BdSelectModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    DataTableModule,
  ],
  providers: [GroupService, TaskCampaignService ],
})
export class GroupSelectCampaignsModule { }
