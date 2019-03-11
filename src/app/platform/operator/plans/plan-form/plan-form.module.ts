import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanFormComponent } from './plan-form.component';
import {RouterModule, Routes} from '@angular/router';
import {ProductFormComponent} from '../../products/product-form/product-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule, MatDatepickerModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule, MatMenuModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import { BdSelectModule } from '../../../../../assets/js/bd-select/bd-select.module';
import { TaskService } from 'app/shared/_services/http/task.service';
import { PlanService } from 'app/shared/_services/http/plan.service';
import { UserService } from 'app/shared/_services/http/user.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PlanResolve } from 'app/shared/_resolves/plan';

const routes: Routes = [
  { path: '', component: PlanFormComponent },
  { path: ':id', component: PlanFormComponent, resolve: { plan: PlanResolve}}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatRadioModule, MatSelectModule, MatButtonModule, MatDatepickerModule,
    BdSelectModule, MatDividerModule, MatMenuModule, DragDropModule, ReactiveFormsModule
  ],
  declarations: [PlanFormComponent],
  providers: [TaskService, PlanService, UserService, PlanResolve]
})
export class PlanFormModule {
}
