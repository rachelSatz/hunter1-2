import { Component, Input } from '@angular/core';

import { PaginationData } from '../classes/pagination-data';

@Component({
	selector: 'app-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: [ './pagination.component.css']
})
export class PaginationComponent {

	@Input() data: PaginationData;
	@Input() theme: 'blue' | 'green' = 'blue';

	getCurrentItems(): number {
		const current = ((this.data.currentPage - 1) * this.data.limit) + 1;
		if (current === 1) {
			return 1;
		}

		return current;
	}

	getMaxShownItems(): number {
		const max = this.data.currentPage * this.data.limit;

		if (this.data.totalItems < max) {
			return this.data.totalItems;
		}

	 	return max;
	}
}
