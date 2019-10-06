import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from 'app/platform/operator/employers/employer-form/settings/settings.component';
import { MatCheckboxModule} from '@angular/material';

const routes: Routes = [
  { path: '', component: SettingsComponent }
];


@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatCheckboxModule
  ]
})
export class SettingsModule { }
