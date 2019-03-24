import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
	selector: 'app-side-filters',
	templateUrl: './side-filters.component.html',
	animations: [
		trigger('slide', [
			state('inactive', style({
				display: 'none',
				width: '0'
			})),
			state('active', style({
				display: '*',
				width: '*'
			})),
			transition('active => inactive', animate('200ms')),
			transition('inactive => active', animate('200ms'))
		]),
		trigger('rotate', [
			state('inactive', style({
				transform: 'rotate(0deg)'
			})),
			state('active', style({
				transform: 'rotate(180deg)'
			})),
			transition('active => inactive', animate('200ms')),
			transition('inactive => active', animate('200ms'))
		])
	]
})
export class SideFiltersComponent implements OnInit {

	@ViewChild('form') form: NgForm;

	@Input() columns;
	@Output() searchSubmitted = new EventEmitter<Object>();

	showFilters = 'inactive';

	ngOnInit() {
		this.columns = this.columns.filter(column => column.searchable !== false);
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
}
