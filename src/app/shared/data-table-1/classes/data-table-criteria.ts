export class DataTableCriteria {
	sort: { column?: string, direction?: 'ASC' | 'DESC' };
	filters: Object;
	page: number;
	keyword: string;
	isCheckAll: boolean;
	checkedItems: Object[];
	employerId: number;

	constructor() {
		this.filters = {};
		this.page = 1;
		this.sort = {};
		this.checkedItems = [];
	}
}
