import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { RouterModule, Routes } from '@angular/router';
import { MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatNativeDateModule, MatTooltipModule } from '@angular/material';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { NewTaskFormComponent } from './new-task-form/new-task-form.component';

const routes: Routes = [{ path: '', component: TasksComponent }];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule, MatFormFieldModule, MatDialogModule
  ],
  declarations: [TasksComponent, NewTaskFormComponent],
  entryComponents: [NewTaskFormComponent]
})
export class TasksModule { }
