import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { AddEmailComponent } from 'app/platform/operator/employers/employer-form/reports/add-email/add-email.component';
import { BdSelectModule } from 'assets/js/bd-select/bd-select.module';
import { DepartmentService } from 'app/shared/_services/http/department.service';

const routes: Routes = [{ path: '', component: ReportsComponent }];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    BdSelectModule
  ],
  declarations: [ReportsComponent, AddEmailComponent],
  entryComponents: [AddEmailComponent],
  providers: [DepartmentService]

})
export class ReportsModule { }
