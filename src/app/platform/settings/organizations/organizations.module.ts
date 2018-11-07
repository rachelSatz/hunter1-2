import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import { OrganizationsComponent } from './organizations.component';

import {DataTableModule} from '../../../shared/data-table/data-table.module';
import { OrganizationService } from 'app/shared/_services/http/organization.service';



const routes: Routes = [
  { path: '', component: OrganizationsComponent },
  { path: 'form', loadChildren: 'app/platform/settings/organizations/organization-form/organization-form.module#OrganizationFormModule' }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule,
  ],
  declarations: [OrganizationsComponent],
  providers: [OrganizationService]
})
export class OrganizationsModule { }
