export class DataTableResponse {
	items: any[];
	total: number;
	lastPage: number;
  other: any;

  constructor(items: any[], total: number, lastPage: number) {
    this.items = items;
    this.total = total;
    this.lastPage = lastPage;
  }


}
