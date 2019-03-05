import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OngoingOperationComponent } from './ongoing-operation.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SkipTaskComponent } from './skip-task/skip-task.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{path: '', component: OngoingOperationComponent}];

    @NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatDialogModule
  ],
  declarations: [SkipTaskComponent],
  entryComponents: [SkipTaskComponent]
})
export class OngoingOperationModule { }
