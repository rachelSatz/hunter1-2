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
      { path: 'compensations', loadChildren: 'app/platform/compensation/compensation.module#CompensationModule' }
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
