import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationsComponent } from './organizations.component';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { NotificationService } from 'app/shared/_services/notification.service';



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
  providers: [OrganizationService, NotificationService]
})
export class OrganizationsModule { }
