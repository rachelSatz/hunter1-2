import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { slideToggle, rotate } from '../../_animations/animation';
import { formatDate } from '@angular/common';

@Component({
	selector: 'app-side-filters',
	templateUrl: './side-filters.component.html',
  styles: ['.ml-1, .mx-1 {color: #E82D5C; } .dateCls{width: 210px;} ::ng-deep .width-200{ width: 200px!important;}'],
	animations: [
    slideToggle, rotate
	]
})
export class SideFiltersComponent implements OnInit {

	@ViewChild('form') form: NgForm;

	@Input() columns;
	@Output() searchSubmitted = new EventEmitter<Object>();
  searchCriteria = {};
	showFilters = 'inactive';

	ngOnInit() {
		this.columns = this.columns.filter(column => column.searchable !== false);
	}


  valueDateChange(event): void {
    this.searchCriteria[event.targetElement.id] =
      formatDate(event['value'], 'yyyy-MM-dd', 'en-US', '+0530').toString();
  }

	search(): void {
		const values = {};
		for (const i in this.form.value) {
			if (this.form.value[i]) {
				values[i] = this.form.value[i];
			}
		}
		this.searchSubmitted.emit(values);
	}

	reset(): void {
		this.form.reset();
		this.search();
	}

	setFilters(): void {
		this.showFilters = (this.showFilters === 'active') ? 'inactive' : 'active';
	}

  getDateMinOrMax(name, val): void {
 	}
}
