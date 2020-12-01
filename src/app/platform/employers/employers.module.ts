import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmployersComponent } from './employers.component';
import { DataTableModule} from '../../shared/data-table/data-table.module';
import { BdSelectModule } from '../../../assets/js/bd-select/bd-select.module';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: EmployersComponent },
  { path: 'form', loadChildren: '../../../app/platform/employers/employer-form/employer-form.module#EmployerFormModule' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule,
    BdSelectModule,
    FormsModule,
  ],
  declarations: [EmployersComponent],

})
export class EmployersModule { }
