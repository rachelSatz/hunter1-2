import { Component, Input, Output, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { NotificationService } from '../_services/notification.service';
import { HelpersService } from '../_services/helpers.service';

import { PaginationData } from './classes/pagination-data';
import { DataTableCriteria } from './classes/data-table-criteria';
import { DataTableResponse } from './classes/data-table-response';
import { DataTableColumn } from './classes/data-table-column';


@Component({
	selector: 'app-data-table',
	templateUrl: './data-table.component.html',
	styleUrls: ['./data-table.component.css'],
	animations: [
		trigger('fade', [
			state('inactive', style({
				display: 'none',
				opacity: '0',
			})),
			state('active', style({
				display: '*',
				opacity: '1',
			})),
			transition('active => inactive', animate('0ms')),
			transition('inactive => active', animate('200ms'))
		]),
		trigger('rotate', [
			state('inactive', style({
				transform: 'rotate(0)',
			})),
			state('active', style({
				transform: 'rotate(180deg)',
			})),
			transition('active => inactive', animate('200ms')),
			transition('inactive => active', animate('200ms'))
		])
	]
})
export class DataTableComponent implements OnInit, OnDestroy {

	@Input() tableName: string;
	@Input() columns: DataTableColumn[] = [];
	@Input() formUrl: string;
	@Input() hasActiveSwitch: boolean;
	@Input() hasCheckColumn: boolean;
	@Input() disableCheckAll = false;
	@Input() hasActionsHeader = true;
  @Input() hasActionsSearch = true;
  @Input() hasExtendedSearch = true;
  @Input() placeHolderSearch = 'חפש';

	@Input() limit = 15;

	@Output() fetchItems = new EventEmitter<boolean>();

	items = [];
	sub = new Subscription;
	criteria = new DataTableCriteria( this.limit);
	paginationData = new PaginationData();
	isLoading: boolean;
	isActive = true;
	savedItem: string;

	constructor(protected router: Router, protected route: ActivatedRoute,
					protected helpers: HelpersService, protected notificationService?: NotificationService) {}

	ngOnInit() {
		this.checkSavedItem('saved-item');

		this.sub.add(this.route.queryParams.subscribe(() => this.init()));
	}

	private init(): void {
		this.criteria.page = (this.route.snapshot.queryParams['page']) ? +this.route.snapshot.queryParams['page'] : 1;
		this.paginationData.currentPage = this.criteria.page;
		this.loadItems();
	}

	loadItems(): void {
		this.helpers.setPageSpinner(true);
		this.isLoading = true;
		this.fetchItems.emit(true);
	}

	setItems(response: DataTableResponse): void {
		this.helpers.setPageSpinner(false);
		this.isLoading = false;
		this.paginationData.totalItems = response && response.total ? response.total : 0;
		this.paginationData.totalPages = response && response.lastPage ? response.lastPage : 0;
		this.items = response && response.items ? response.items : [];
		this.items.map((item) => {
			item.checked = this.criteria.isCheckAll;
			this.criteria.checkedItems.map(checkedItem => {
				if (checkedItem['id'] === item['id']) {
					item.checked = !this.criteria.isCheckAll;
				}
			});
		});
	}

	checkSavedItem(key: string): void {
		if (sessionStorage.getItem(key)) {
			this.savedItem = sessionStorage.getItem(key);
			sessionStorage.removeItem(key);
		}
	}

	search(event?: KeyboardEvent): void {
    if (((event && (event.code === 'Enter' || event.code === 'NumpadEnter')) || !event) && !this.isLoading) {
      this.loadItems();
    }
	}

	extendedSearch(values: Object): void {
		this.criteria.filters = values;

    if (this.criteria.page  > 1) {
      this.criteria.page = 1;
      this.paginationData.currentPage = this.criteria.page;

      const url: string = this.router.url.substring(0, this.router.url.indexOf('?'));
      this.router.navigateByUrl(url);
    } else {
      this.search();
    }
	}

	sort(column: DataTableColumn): void {
	  if (column.isSort !== false) {
      this.criteria.sort.column = column.sortName ? column.sortName : column.name;
      this.criteria.sort.column_show = column.name;
      this.criteria.sort.direction = (this.criteria.sort.direction === 'DESC') ? 'ASC' : 'DESC';
      this.loadItems();
    }
	}

	checkAll(isChecked: boolean): void {
		this.criteria.isCheckAll = isChecked;

		this.criteria.checkedItems = [];

		this.items.forEach(item => {
			item['checked'] = isChecked;
		});
	}

	checkItem(item: any, isChecked: boolean): void {
		item['checked'] = isChecked;
		if (this.criteria.isCheckAll) {
			if (isChecked) {
				this.removeFromCheckedItemsList(item);
			} else {
				this.addToCheckedItemsList(item);
			}
		} else {
			if (isChecked) {
				this.addToCheckedItemsList(item);
			} else {
				this.removeFromCheckedItemsList(item);
			}
		}
	}

	private addToCheckedItemsList(item: any): void {
		this.criteria.checkedItems.push(item);
	}

	private removeFromCheckedItemsList(item: any): void {
		this.criteria.checkedItems.some((checkedItem, index) => {
			if (checkedItem['id'] === item.id) {
				this.criteria.checkedItems.splice(+index, 1);
				return true;
			}
		});
	}

	setNoneCheckedWarning(): void {
		this.notificationService.error('לא נבחרו רשומות', 'יש לסמן רשומות מהטבלה');
	}

	rotateSortingIcon(): string {
		return (this.criteria.sort.direction === 'DESC') ? 'inactive' : 'active';
	}

	toggleActiveStatus(isActive: boolean): void {
		this.isActive = isActive;
		this.loadItems();
	}

	nextItem(currentIndex: number): any {
		if (currentIndex === this.criteria.limit - 1) {
			if (this.paginationData.currentPage === this.paginationData.totalPages) {
				return false;
			}

			return this.router.navigate(['./'], { queryParams: { page: this.paginationData.currentPage + 1 } })
			.then(() => 0);
		}

		return currentIndex + 1;
	}

	previousItem(currentIndex: number): any {
		if (currentIndex === 0) {
			if (this.paginationData.currentPage === 0) {
				return false;
			}

			return this.router.navigate(['./'], { queryParams: { page: this.paginationData.currentPage + 1 } })
			.then(() => this.criteria.limit - 1);
		}

		return currentIndex - 1;
	}

  searchColumn(val) {
    return this.columns.find(iteratedColumn => iteratedColumn.name === val);
  }

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}
