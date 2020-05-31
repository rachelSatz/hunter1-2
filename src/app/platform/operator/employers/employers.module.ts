import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';

import { EmployersComponent } from './employers.component';

import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import {EmployerMovesManagerComponent} from './creating-employer/employer-moves-manager/employer-moves-manager.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import {GroupService} from '../../../shared/_services/http/group.service';
import {GeneralHttpService} from '../../../shared/_services/http/general-http.service';
// import {CreatingEmployerComponent} from './creating-employer/creating-employer.component';


const routes: Routes = [
  { path: '', component: EmployersComponent },
  { path: 'form', loadChildren: 'app/platform/operator/employers/employer-form/employer-form.module#EmployerFormModule' },
  { path: 'new', loadChildren: 'app/platform/operator/employers/new-employer/new-employer.module#NewEmployerModule' },
  { path: 'creating', loadChildren: 'app/platform/operator/employers/creating-employer/creating-employer.module#CreatingEmployerModule'}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule,
    MatDialogModule,
    BdSelectModule,

  ],
  declarations: [
    EmployersComponent, EmployerMovesManagerComponent, GroupDetailsComponent
  ],
  providers: [EmployerService, NotificationService, GroupService, GeneralHttpService],
  entryComponents: [EmployerMovesManagerComponent, GroupDetailsComponent]

})
export class EmployersModule { }
