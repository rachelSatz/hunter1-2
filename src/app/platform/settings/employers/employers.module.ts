import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { EmployersComponent } from './employers.component';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { FilterItemsPipe } from '../../../shared/_pipes/filter-items.pipe';

const routes: Routes = [
  { path: '', component: EmployersComponent },
  { path: 'form', loadChildren: 'app/platform/settings/employers/employer-form/employer-form.module#EmployerFormModule' }
];



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  declarations: [EmployersComponent],
  providers: [EmployerService ]
})
export class EmployersModule { }
