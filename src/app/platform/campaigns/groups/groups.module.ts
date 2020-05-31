import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsComponent} from './groups.component';
import { RouterModule, Routes} from '@angular/router';
import { NotificationService} from '../../../shared/_services/notification.service';
import { DataTableModule} from '../../../shared/data-table/data-table.module';
import { BdSelectModule} from '../../../../assets/js/bd-select/bd-select.module';
import { AddToGroupDialogComponent } from './add-to-group-dialog/add-to-group-dialog.component';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [
  { path: '', component: GroupsComponent }
];

@NgModule({
  declarations: [GroupsComponent, AddToGroupDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule,
    BdSelectModule,
    MatProgressBarModule,
    ReactiveFormsModule
  ],
  providers: [NotificationService],
  entryComponents: [AddToGroupDialogComponent],
})
export class GroupsModule { }
