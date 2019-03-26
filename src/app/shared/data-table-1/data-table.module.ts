import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatSelectModule,
			MatSlideToggleModule, MatTooltipModule } from '@angular/material';
import { PipesModule } from '../_pipes/pipes.module';
import { BdSelectModule } from 'assets/js/bd-select/bd-select.module';
// import { DateInputModule } from '../_directives/date-input.module';

import { DataTableComponent } from './data-table.component';
import { PaginationComponent } from './pagination/pagination.component';
import { SideFiltersComponent } from './side-filters/side-filters.component';
import {DatePickerModule} from '../app-date-picker/app-date-picker.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatMenuModule, MatCheckboxModule,
		MatTooltipModule, MatButtonModule,
		RouterModule,
		PipesModule,
		BdSelectModule,
    DatePickerModule
	],
	exports: [
		CommonModule,
		FormsModule,
		MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatMenuModule, MatCheckboxModule,
		MatTooltipModule, MatButtonModule,
		RouterModule,
		PipesModule,
		PaginationComponent,
		SideFiltersComponent,
		BdSelectModule,
		DataTableComponent
	],
	declarations: [DataTableComponent, PaginationComponent, SideFiltersComponent],
})
export class DataTableModule {
  private static DateInputModule: any;
}
