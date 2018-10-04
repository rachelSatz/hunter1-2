import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DataTableComponent } from './data-table.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
	imports: [CommonModule, RouterModule],
	exports: [CommonModule, MatTooltipModule, PaginationComponent],
	declarations: [DataTableComponent, PaginationComponent]
})
export class DataTableModule {}
