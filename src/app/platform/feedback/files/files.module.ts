import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesComponent } from './files.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes} from '@angular/router';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import {MatDialogModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatTooltipModule} from '@angular/material';
import {FormComponent} from './form/form.component';

const routes: Routes = [
  { path: '', component: FilesComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    DataTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule
  ],
  declarations: [FilesComponent, FormComponent],
  providers: [NotificationService],
  entryComponents: [FormComponent]
})
export class FilesModule { }
