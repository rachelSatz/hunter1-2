import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './employees.component';
import {RouterModule, Routes} from '@angular/router';
import { MatDialogModule, MatFormFieldModule, MatInputModule,
         MatOptionModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { SendApplicationComponent } from './send-application/send-application.component';

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
    MatOptionModule
  ],
  exports: [],
  declarations: [EmployeesComponent, SendApplicationComponent],
  entryComponents: [SendApplicationComponent]
})
export class EmployeesModule { }
