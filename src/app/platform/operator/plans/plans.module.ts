import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlansComponent } from './plans.component';
import { RouterModule, Routes} from '@angular/router';
import { DataTableModule } from 'app/shared/data-table-1/data-table.module';
import {
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatNativeDateModule,
  MatSelectModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {PlanService} from '../../../shared/_services/http/plan.service';
import {NotificationService} from '../../../shared/_services/notification.service';


const routes: Routes = [
  { path: '', component: PlansComponent},
  { path: 'form', loadChildren: 'app/platform/operator/plans/plan-form/plan-form.module#PlanFormModule' }
];

@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
    RouterModule.forChild(routes),
    FormsModule,
    HttpClientModule,
    RouterModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatMenuModule,
    MatNativeDateModule, MatDatepickerModule
  ],
  declarations: [PlansComponent],
  providers: [PlanService, NotificationService]
})
export class PlansModule { }
