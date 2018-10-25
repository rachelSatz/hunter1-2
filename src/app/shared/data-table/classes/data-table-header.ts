import { DataTableSearchCriteria } from './data-table-search-criteria';

export interface DataTableHeader {
	column: string;
	label: string;
	searchOptions?: { property?: string, labels?: any, defaultLabel?: any, isDate?: boolean };
	type?: string;
	selectCriteria?: DataTableSearchCriteria[];
}

export interface DataTableHeader {
	column: string;
	label: string;
}
