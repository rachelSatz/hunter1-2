import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { DataTableHeader } from './classes/data-table-header';
import { DataTableOrderCriteria } from './classes/data-table-order-criteria';
import { PaginationData } from './classes/pagination-data';

declare let swal: any;

@Component({
	selector: 'app-data-table',
	template: '',
	styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit, OnDestroy {

	headers: DataTableHeader[] = [];

	items = [];

	paginatedItems: any[];
	paginationData = new PaginationData();
	isSearching = false;
	isPaginated = false;
	searchCriteria ={};
	orderCriteria = new DataTableOrderCriteria();

	savedItem: string;

	pageSubscription: Subscription;
	currentPage: number;

	isCheckAll: boolean;
	checkedItems: any[] = [];

	constructor(protected route: ActivatedRoute) {}

	ngOnInit() {
		if (sessionStorage.getItem('saved-item')) {
			this.savedItem = sessionStorage.getItem('saved-item');
			sessionStorage.removeItem('saved-item');
		}

		// this.pageSubscription = this.route.queryParams.subscribe((message) => {
		// 	  console.log("DataTableComponent-page");
		//   if (this.items.length > 0) {
		// 	 this.setCurrentPage(+message['page']);
		//   }
		// });

		this.fetchItems();
	}

	setItems(items: any[]): void {
		this.isSearching = false;

		this.items = items;
		this.paginationData.totalItems = this.items.length;
		this.paginateItems();
	}

	paginateItems(): void {
		const totalPages = Math.ceil(this.paginationData.totalItems / this.paginationData.limit);
		this.paginationData.totalPages = (totalPages > 0) ? totalPages : 1;

		this.setCurrentPage();
	}

	protected setCurrentPage(page?: number): void {

		if (!page) {
			this.currentPage = (this.route.snapshot.queryParams['page']) ? +this.route.snapshot.queryParams['page'] : 1;
		} else {
			this.currentPage = page;
		}

		if (this.currentPage > this.paginationData.totalPages) {
			this.currentPage = this.paginationData.totalPages;
		}

		this.paginationData.currentPage = this.currentPage;

		const data = this.paginationData;

		this.paginatedItems = this.items ? this.items.slice((data.currentPage - 1) * data.limit, data.currentPage * data.limit) : [];

		this.isPaginated = true;
	}

	search(keyCode?: number): void {
		if (keyCode && keyCode !== 13) {
			return;
		}

		this.isPaginated = false;
		this.isSearching = true;
		setTimeout(() => this.fetchItems(), 1000);
	}

	sort(column: string): void {
		this.orderCriteria.orderBy = column;
		this.orderCriteria.orderDir = (this.orderCriteria['dir'] === 'DESC') ? 'ASC' : 'DESC';
		this.fetchItems();
	}

	fetchItems() {}

	setLimit(limit: number): void {
		this.paginationData.limit = limit;
		this.paginateItems();
	}

	confirmDelete(): Promise<boolean> {
		return swal({
			title: 'מחיקה',
			text: 'האם אתה בטוח?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'אישור',
			cancelButtonText: 'ביטול'
		}).then((result) => result);
	}

	showDeleteSuccess(): void {
		swal({
			title: '',
			text: 'המחיקה בוצעה בהצלחה',
			type: 'success',
			confirmButtonText: 'אישור'
		});
	}

	setNewItem(item: any): void {
		debugger;
		this.items.unshift(item);
		this.paginateItems();
	}

	checkAll(isChecked: boolean): void {
		if (isChecked) {
			this.checkedItems = Object.assign([], this.paginatedItems);
			this.isCheckAll = true;
		} else {
			this.checkedItems = [];
			this.isCheckAll = false;
		}
	}

	checkItem(item: any, isChecked: boolean): void {
		if (isChecked) {
			this.checkedItems.push(item);
		} else {
			for (const index in this.checkedItems) {
				if (this.checkedItems[index].id === item.id) {
					this.checkedItems.splice(+index, 1);
					return;
				}
			}
		}
	}

	setNoneCheckedWarning(): void {
		swal({
			title: 'לא נבחרו רשומות',
			text: 'יש לסמן רשומות מהטבלה',
			type: 'warning',
			confirmButtonText: 'המשך'
		});
	}

	getHeaderIconClass(): 'fa fa-chevron-down' | 'fa fa-chevron-up' {
		if (this.orderCriteria.orderDir === 'DESC') {
			return 'fa fa-chevron-down';
		}

		return 'fa fa-chevron-up';
	}

	ngOnDestroy() {
		if (this.pageSubscription) {
			this.pageSubscription.unsubscribe();
		}
	}
}
