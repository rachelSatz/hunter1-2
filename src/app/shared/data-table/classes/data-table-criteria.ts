export class DataTableCriteria {
	sort: { column_show?: string, column?: string, direction?: 'ASC' | 'DESC' };
	filters: Object;
	page: number;
  limit: number;
	keyword: string;
	isCheckAll: boolean;
	checkedItems: Object[];
	employerId: number;

	constructor(limit?: number) {
		this.filters = {};
		this.page = 1;
    this.limit =  this.limit = limit ? limit : 30;
		this.sort = {};
		this.checkedItems = [];
	}
}
