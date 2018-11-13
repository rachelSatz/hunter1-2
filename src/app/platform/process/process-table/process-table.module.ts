import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessTableComponent } from './process-table.component';
import {RouterModule, Routes} from '@angular/router';
import {DataTableModule} from '../../../shared/data-table/data-table.module';
import {ProcessService} from '../../../shared/_services/http/process.service';
import {FormsModule} from '@angular/forms';

const routes: Routes = [
  { path: '', component: ProcessTableComponent },
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  declarations: [ProcessTableComponent],
  providers: [ProcessService]
})
export class ProcessTableModule { }
