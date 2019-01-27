import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesComponent } from './files.component';
import { NotificationService } from 'app/shared/_services/notification.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes} from '@angular/router';
import { DataTableModule } from 'app/shared/data-table/data-table.module';

const routes: Routes = [
  { path: '', component: FilesComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  declarations: [FilesComponent],
  providers: [NotificationService]
})
export class FilesModule { }
