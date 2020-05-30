import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CampaignsTypeComponent } from './campaigns-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BdSelectModule } from '../../../../../assets/js/bd-select/bd-select.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DataTableModule } from '../../../../shared/data-table/data-table.module';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {TaskCampaignService} from '../../../../shared/_services/campaign-data-service';


const routes: Routes = [
  { path: '', component: CampaignsTypeComponent }
];

@NgModule({
  declarations: [CampaignsTypeComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        BdSelectModule,
        MatRadioModule,
        MatFormFieldModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        DataTableModule,
        MatButtonToggleModule
    ],
  providers: [TaskCampaignService]
})
export class CampaignsTypeModule { }
