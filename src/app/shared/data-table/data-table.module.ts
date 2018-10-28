import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatSelectModule,
			MatSlideToggleModule, MatTooltipModule } from '@angular/material';

import { DataTableComponent } from './data-table.component';
import { PaginationComponent } from './pagination/pagination.component';

import { PipesModule } from '../_pipes/pipes.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatMenuModule, MatCheckboxModule,
		MatTooltipModule, MatButtonModule,
		RouterModule,
		PipesModule
	],
	exports: [
		CommonModule,
		FormsModule,
		MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatMenuModule, MatCheckboxModule,
		MatTooltipModule, MatButtonModule,
		RouterModule,
		PipesModule,
		PaginationComponent
	],
	declarations: [DataTableComponent, PaginationComponent],
})
export class DataTableModule {}
