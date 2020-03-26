import {RouterModule, Routes} from '@angular/router';
import {EmployerEmployeesComponent} from './employer-employees.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataTableModule} from '../../../shared/data-table/data-table.module';
import {BdSelectModule} from '../../../../assets/js/bd-select/bd-select.module';
import {EmployerService} from '../../../shared/_services/http/employer.service';
import {NotificationService} from '../../../shared/_services/notification.service';

const routes: Routes = [
  { path: '', component: EmployerEmployeesComponent }
  ];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule,
    BdSelectModule
  ],
  declarations: [
    EmployerEmployeesComponent
  ],
  providers: [EmployerService, NotificationService],

})
export class EmployerEmployeesModule { }
