import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefrayalComponent } from './defrayal.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: DefrayalComponent }];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DefrayalComponent]
})
export class DefrayalModule { }
