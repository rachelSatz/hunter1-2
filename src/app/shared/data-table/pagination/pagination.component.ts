import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: [ './pagination.component.css']
})
export class PaginationComponent {

	@Input() data:  any;
	@Input() theme: 'blue' | 'green' = 'blue';

	getCurrentItems(): number {
		const current = ((this.data.paginationData.currentPage - 1) * this.data.limit) + 1;
		if (current === 1) {
			return 1;
		}

		return current;
	}

	getMaxShownItems(): number {
		const max = this.data.paginationData.currentPage * this.data.limit;

		if (this.data.paginationData.totalItems < max) {
			return this.data.paginationData.totalItems;
		}

	 	return max;
	}
}
