import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { NotificationService } from '../_services/notification.service';

import { DataTableHeader } from './classes/data-table-header';
import { DataTableOrderCriteria } from './classes/data-table-order-criteria';
import { PaginationData } from './classes/pagination-data';

@Component({
	selector: 'app-data-table',
	template: ''
})
export class DataTableComponent implements OnInit, OnDestroy {

	headers: DataTableHeader[] = [];

	items = [];
	paginatedItems: any[];

	paginationData = new PaginationData();

	isSearching: boolean;
	isPaginated: boolean;

	searchCriteria = {};
	orderCriteria = new DataTableOrderCriteria();

	savedItem: string;

	pageSubscription: Subscription;
	currentPage: number;

	isCheckAll: boolean;
	checkedItems: any[] = [];

	constructor(protected route: ActivatedRoute, protected notificationService?: NotificationService) {}

	ngOnInit() {
		if (sessionStorage.getItem('saved-item')) {
			this.savedItem = sessionStorage.getItem('saved-item');
			sessionStorage.removeItem('saved-item');
		}

    this.pageSubscription = this.route.queryParams.subscribe(message => {
      if (this.items.length > 0) {
        this.setCurrentPage(+message['page']);
        // this.searchCriteria['page'] = +message['page'];
        // this.fetchItems();

      }
    });

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

  resetSearch(): void {
	  this.searchCriteria = {};
	  this.search();
  }

  isSearchActive(): boolean {
	  return Object.keys(this.searchCriteria).length > 0;
  }

  sort(header: DataTableHeader): void {
    if (this.items) {
      this.orderCriteria.orderBy = header.column;
      this.orderCriteria.orderDir = (this.orderCriteria.orderDir === 'DESC') ? 'ASC' : 'DESC';

      this.items.sort((a, b) => {

        let val1 = a[header.column];
        let val2 = b[header.column];

        if (header.searchOptions) {
          if (header.searchOptions.property) {
            val1 = val1[header.searchOptions.property];
            val2 = val2[header.searchOptions.property];
          }

          if (header.searchOptions.labels) {
            val1 = header.searchOptions.labels[val1];
            val2 = header.searchOptions.labels[val2];
          }

          if (header.searchOptions.isDate) {
            if (val1) {
              val1 = this.getDateObj(val1);
            }

            if (val2) {
              val2 = this.getDateObj(val2);
            }
          }

          if (header.searchOptions.defaultLabel) {
            if (!val1) {
              val1 = header.searchOptions.defaultLabel;
            }

            if (!val2) {
              val2 = header.searchOptions.defaultLabel;
            }
          }
        }

        if (val1 === null || val1 < val2) {
          return this.orderCriteria.orderDir === 'ASC' ? -1 : 1;
        }

        if (val2 === null || val1 > val2) {
          return this.orderCriteria.orderDir === 'ASC' ? 1 : -1;
        }

        return 0;
      });

      this.paginateItems();
    }
  }

  protected getDateObj(val: any): Object {
    let day = 1;
    let month = val.substr(0, 2);
    let year = val.substr(3);

    if (val.length > 7) {
      day = val.substr(0, 2);
      month = val.substr(3, 2);
      year = val.substr(6);
    }

    return new Date(year, month, day);
  }

  fetchItems() {}

	setLimit(limit: number): void {
		this.paginationData.limit = limit;
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
		  item['isChecked'] = true;
			this.checkedItems.push(item);
		} else {
      item['isChecked'] = false;

      for (const index in this.checkedItems) {
				if (this.checkedItems[index].id === item.id) {
					this.checkedItems.splice(+index, 1);
					return;
				}
			}
		}
	}

	setNoneCheckedWarning(): void {
	  this.notificationService.error('לא נבחרו רשומות', 'יש לסמן רשומות מהטבלה');
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


// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Subscription } from 'rxjs/Subscription';
//
// import { NotificationService } from '../_services/notification.service';
//
// import { FilterItemsPipe } from '../_pipes/filter-items.pipe';
//
// import { DataTableHeader } from './classes/data-table-header';
// import { DataTableOrderCriteria } from './classes/data-table-order-criteria';
// import { DataTableSearchCriteria } from './classes/data-table-search-criteria';
// import { PaginationData } from './classes/pagination-data';
//
// @Component({
//   selector: 'app-data-table',
//   template: '',
//   styleUrls: ['./data-table.component.css']
// })
// export class DataTableComponent implements OnInit, OnDestroy {
//
//   headers: DataTableHeader[] = [];
//
//   items = [];
//   filteredItems = [];
//
//   paginatedItems: any[];
//   paginationData = new PaginationData();
//   isSearching = false;
//   isPaginated = false;
//   searchCriteria: any = new DataTableSearchCriteria();
//   orderCriteria = new DataTableOrderCriteria();
//
//   savedItem: string;
//
//   pageSubscription: Subscription;
//   currentPage: number;
//
//   isCheckAll: boolean;
//   checkedItems: any[] = [];
//
//   limitSelection = [30, 50, 100, 200];
//
//   hasActionPermission: boolean;
//
//   constructor(protected route: ActivatedRoute, protected filterItems: FilterItemsPipe,
//               protected notificationService?: NotificationService) {}
//
//   ngOnInit() {
//     this.isSearching = true;
//
//     if (sessionStorage.getItem('saved-item')) {
//       this.savedItem = sessionStorage.getItem('saved-item');
//       sessionStorage.removeItem('saved-item');
//     }
//
//     this.pageSubscription = this.route.queryParams.subscribe((message) => {
//       if (this.items.length > 0) {
//         this.setCurrentPage(+message['page']);
//       }
//     });
//
//     this.fetchItems();
//   }
//
//   checkSavedItem(key: string): void {
//     if (sessionStorage.getItem(key)) {
//       this.savedItem = sessionStorage.getItem(key);
//       sessionStorage.removeItem(key);
//     }
//   }
//
//   setItems(items: any[]): void {
//     if (!items) {
//       items = [];
//     }
//
//     this.items = items;
//     this.isSearching = false;
//
//     if (this.searchCriteria.value) {
//       this.search();
//       return;
//     }
//
//     this.filteredItems = this.items;
//
//     const routeCriteria = this.route.snapshot.queryParams['q'];
//     if (routeCriteria) {
//       this.searchCriteria.value = routeCriteria;
//       this.filteredItems = this.filterItems.transform(this.filteredItems, this.searchCriteria.value, this.headers);
//     }
//
//     if (items) {
//       this.paginationData.totalItems = this.filteredItems.length;
//       this.paginateItems();
//     }
//   }
//
//   paginateItems(): void {
//     const totalPages = Math.ceil(this.paginationData.totalItems / this.paginationData.limit);
//     this.paginationData.totalPages = (totalPages > 0) ? totalPages : 1;
//
//     this.setCurrentPage();
//   }
//
//   protected setCurrentPage(page?: number): void {
//     if (!page) {
//       this.currentPage = (this.route.snapshot.queryParams['page']) ? +this.route.snapshot.queryParams['page'] : 1;
//     } else {
//       this.currentPage = page;
//     }
//
//     if (this.currentPage > this.paginationData.totalPages) {
//       this.currentPage = this.paginationData.totalPages;
//     }
//
//     this.paginationData.currentPage = this.currentPage;
//
//     const data = this.paginationData;
//
//     this.paginatedItems = this.filteredItems
//       ? this.filteredItems.slice((data.currentPage - 1) * data.limit, data.currentPage * data.limit) : [];
//
//     this.isPaginated = true;
//   }
//
//   search(): void {
//     if (!this.isSearching) {
//       this.isSearching = true;
//
//       setTimeout(() => {
//         const key = Object.keys(this.searchCriteria)[1];
//
//         if (key && key === 'value') {
//           this.filteredItems = this.filterItems.transform(this.items, this.searchCriteria.value, this.headers);
//         } else {
//           this.searchByProperties();
//         }
//
//         this.isSearching = false;
//         this.paginationData.totalItems = this.filteredItems.length;
//         this.paginateItems();
//       }, 500);
//     }
//   }
//
//   protected searchByProperties(): void {
//     let items = this.items;
//
//     for (const criterion in this.searchCriteria) {
//       if (!this.searchCriteria[criterion]) {
//         continue;
//       }
//
//       if (criterion === 'q') {
//         items = this.filterItems.transform(items, this.searchCriteria['q'], this.headers);
//       } else {
//         let value = this.searchCriteria[criterion].type ? this.searchCriteria[criterion].value : this.searchCriteria[criterion];
//
//         if (value && value.id) {
//           value = value.name;
//         }
//
//         if (value && this.searchCriteria[criterion].type === 'date') {
//           const date = new Date(this.searchCriteria[criterion].value);
//           const day = date.getDate().toString().length === 1 ? '0' + date.getDate().toString() : date.getDate();
//           let month: any = date.getMonth() + 1;
//           month = month.toString().length === 1 ? '0' + month.toString() : month;
//
//           value = day + '/' + month + '/' + date.getFullYear();
//         }
//
//         if (value) {
//           items = items.filter(item => {
//             return item[criterion] === value;
//           });
//         }
//       }
//     }
//
//     this.filteredItems = items;
//   }
//
//   resetSearch(): void {
//     for (const i in Object.keys(this.searchCriteria)) {
//       const entry = this.searchCriteria[Object.keys(this.searchCriteria)[i]];
//       this.searchCriteria[Object.keys(this.searchCriteria)[i]] = entry && entry.type ? { value: null, type: entry.type } : null;
//     }
//
//     this.filteredItems = this.items;
//     this.paginateItems();
//   }
//
//   sort(header: DataTableHeader): void {
//     if (this.items) {
//       this.orderCriteria.orderBy = header.column;
//       this.orderCriteria.orderDir = (this.orderCriteria.orderDir === 'DESC') ? 'ASC' : 'DESC';
//
//       this.filteredItems.sort((a, b) => {
//
//         let val1 = a[header.column];
//         let val2 = b[header.column];
//
//         if (header.searchOptions) {
//           if (header.searchOptions.property) {
//             val1 = val1[header.searchOptions.property];
//             val2 = val2[header.searchOptions.property];
//           }
//
//           if (header.searchOptions.labels) {
//             val1 = header.searchOptions.labels[val1];
//             val2 = header.searchOptions.labels[val2];
//           }
//
//           if (header.searchOptions.isDate) {
//             if (val1) {
//               val1 = this.getDateObj(val1);
//             }
//
//             if (val2) {
//               val2 = this.getDateObj(val2);
//             }
//           }
//
//           if (header.searchOptions.defaultLabel) {
//             if (!val1) {
//               val1 = header.searchOptions.defaultLabel;
//             }
//
//             if (!val2) {
//               val2 = header.searchOptions.defaultLabel;
//             }
//           }
//         }
//
//         if (val1 === null || val1 < val2) {
//           return this.orderCriteria.orderDir === 'ASC' ? -1 : 1;
//         }
//
//         if (val2 === null || val1 > val2) {
//           return this.orderCriteria.orderDir === 'ASC' ? 1 : -1;
//         }
//
//         return 0;
//       });
//
//       this.paginateItems();
//     }
//   }
//
//   protected getDateObj(val: any): Object {
//     let day = 1;
//     let month = val.substr(0, 2);
//     let year = val.substr(3);
//
//     if (val.length > 7) {
//       day = val.substr(0, 2);
//       month = val.substr(3, 2);
//       year = val.substr(6);
//     }
//
//     return new Date(year, month, day);
//   }
//
//   fetchItems() {}
//
//   setNewItem(item: any): void {
//     this.items.unshift(item);
//     this.paginateItems();
//   }
//
//   checkAll(isChecked: boolean): void {
//     if (isChecked) {
//       this.checkedItems = Object.assign([], this.filteredItems);
//       this.checkedItems.forEach(item => {
//         item['checked'] = true;
//       });
//
//       this.isCheckAll = true;
//     } else {
//       this.checkedItems.forEach(item => {
//         item['checked'] = false;
//       });
//
//       this.checkedItems = [];
//       this.isCheckAll = false;
//     }
//   }
//
//   checkItem(item: any, isChecked: boolean): void {
//     if (isChecked) {
//       this.checkedItems.push(item);
//       item['checked'] = true;
//     } else {
//       item['checked'] = false;
//       for (const index in this.checkedItems) {
//         if (this.checkedItems[index].id === item.id) {
//           this.checkedItems.splice(+index, 1);
//           return;
//         }
//       }
//     }
//   }
//
//   setNoneCheckedWarning(): void {
//     this.notificationService.error('לא נבחרו רשומות', 'יש לסמן רשומות מהטבלה');
//   }
//
//   setSingleCheckedWarning(): void {
//     this.notificationService.error('נבחרה יותר מרשומה אחת', 'יש לסמן רשומה אחת מהטבלה');
//   }
//
//   getHeaderIconClass(): 'fa fa-chevron-down' | 'fa fa-chevron-up' {
//     if (this.orderCriteria.orderDir === 'DESC') {
//       return 'fa fa-chevron-down';
//     }
//     return 'fa fa-chevron-up';
//   }
//
//   ngOnDestroy() {
//     if (this.pageSubscription) {
//       this.pageSubscription.unsubscribe();
//     }
//   }
//
//   isSearchActive(): boolean {
//     return Object.keys(this.searchCriteria).length > 0;
//   }
// }
