import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './employees.component';
import { RouterModule, Routes } from '@angular/router';
import {
  MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatNativeDateModule,
  MatOptionModule, MatSelectModule, MatTooltipModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { SendApplicationComponent } from './send-application/send-application.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { BdSelectModule } from 'assets/js/bd-select/bd-select.module';

const routes: Routes = [{
  path: '', component: EmployeesComponent
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    BdSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [],
  declarations: [EmployeesComponent, SendApplicationComponent],
  entryComponents: [SendApplicationComponent],
  providers: [NotificationService]
})
export class EmployeesModule { }
