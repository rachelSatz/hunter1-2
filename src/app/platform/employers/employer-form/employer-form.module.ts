import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {EmployerFormComponent} from './employer-form.component';
import {EmployersResolve} from '../../../shared/_resolves/employers.resolve';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule, MatDatepickerModule, MatDividerModule,
  MatError,
  MatFormFieldModule, MatIconModule,
  MatInputModule, MatMenuModule, MatOptionModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import {BdSelectModule} from '../../../../assets/js/bd-select/bd-select.module';
import { DocumentsComponent } from './documents/documents.component';
import {PlatformComponent} from '../../platform.component';

const routes: Routes = [
  { path: '', component: EmployerFormComponent},
  { path: ':id', component: EmployerFormComponent, resolve: { employer: EmployersResolve }, children: [
      { path: '' , redirectTo: 'finance', pathMatch: 'full'},
      { path: 'finance', loadChildren: '../../../../app/platform/employers/employer-form/finance/finance.module#FinanceModule' },
      { path: 'documents', loadChildren: '../../../../app/platform/employers/employer-form/documents/documents.module#DocumentsModule' },
] }
];


@NgModule({
  declarations: [EmployerFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    BdSelectModule,
    MatOptionModule,
    MatMenuModule,
    MatDividerModule,
    MatDatepickerModule
  ],
  providers: [EmployersResolve, PlatformComponent]
})
export class EmployerFormModule { }
