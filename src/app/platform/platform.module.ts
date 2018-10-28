import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

import { PlatformComponent } from './platform.component';

import { IsAuthenticatedGuard } from '../shared/_guards/is-authenticated.guard';

const routes: Routes = [
  {
    path: '', component: PlatformComponent, canActivate: [IsAuthenticatedGuard], children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // { path: 'compensations', loadChildren: 'app/platform/compensation/process/process.module#ProcessModule' },
      { path: 'compensations/process', loadChildren: 'app/platform/compensation/process/process.module#ProcessModule' },
      { path: 'compensations/dashboard', loadChildren: 'app/platform/compensation/dashboard/dashboard.module#DashboardModule' },
      { path: 'settings/contacts', loadChildren: 'app/platform/settings/contacts/contacts.module#ContactsModule' },
      { path: 'settings/employers', loadChildren: 'app/platform/settings/employers/employers.module#EmployersModule' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatMenuModule,
  ],
  declarations: [PlatformComponent],
  providers: [IsAuthenticatedGuard]
})
export class PlatformModule {}
