import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details.component';
import { RouterModule, Routes} from '@angular/router';
import { DetailedFilesComponent } from '../detailed-files/detailed-files.component';
import { DetailedRecordsComponent } from '../detailed-records/detailed-records.component';
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatMenuModule, MatProgressBarModule,
  MatSelectModule, MatTooltipModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';


const routes: Routes = [
  { path: '', component: DetailsComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule, MatInputModule, MatDialogModule,
    MatCheckboxModule, MatSelectModule, MatChipsModule,
    MatIconModule, MatAutocompleteModule, MatProgressBarModule, MatMenuModule,
    FormsModule, MatTooltipModule
  ],
  declarations: [DetailsComponent, DetailedRecordsComponent, DetailedFilesComponent]
})
export class DetailsModule { }
