import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input, OnChanges,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { isArray } from 'rxjs/util/isArray';

@Component({
	selector: 'bd-select',
	templateUrl: './bd-select.component.html',
	styleUrls: ['./bd-select.component.css'],
	animations: [
		trigger('BDslideToggle', [
			state('inactive', style({
				display: 'none',
				height: '0',
				opacity: '0'
			})),
			state('active', style({
				display: 'block',
				height: '*',
				opacity: '1'
			})),
			transition('active => inactive', animate('100ms ease-in')),
			transition('inactive => active', animate('300ms ease-out'))
		])
	],
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: BdSelectComponent, multi: true }
	]
})
export class BdSelectComponent implements ControlValueAccessor, OnChanges {

	@Input() multiple = false;
	@Input() value = 'id';
	@Input() label = 'name';
	@Input() items = [];
	@Input() placeholder = 'בחר פריטים';
	@Input() searchPlaceholder = 'חפש...';
	@Input() searchableProperties = false;

	@Output() onSelect: EventEmitter<Object | Object[]> = new EventEmitter();
	@Output() onDeselect: EventEmitter<boolean> = new EventEmitter();

	@Input() @HostBinding('style.width') width = '100%';

	@ViewChild('filterValueEle') filterElement: ElementRef;

	filterValue: string;

	unfilteredItems = [];

	isSelectOpened = false;

	elementRef: ElementRef;

	selectedItem: any;

	private propagateChange = (_: any) => {};

	constructor(el: ElementRef) {
		this.elementRef = el;
	}

	@HostListener('document:click')
	documentClicked() {
		if (!this.isSelectOpened) {
			return;
		}

		let clickedComponent = event.target;
		let inside = false;

		do {
			if (clickedComponent === this.elementRef.nativeElement) {
				inside = true;
			}

			clickedComponent = clickedComponent['parentNode'];
		} while (clickedComponent);

		if (!inside) {
			this.isSelectOpened = false;
			setTimeout(() => {
				this.filterValue = '';

				if (this.unfilteredItems.length > 0) {
					this.items = this.unfilteredItems;
				}

			}, 500);
		}
	}

	filter(): void {
		if (this.unfilteredItems.length === 0) {
			this.unfilteredItems = this.items;
		}

		if (!this.searchableProperties) {
			this.items = this.unfilteredItems.filter(item => item[this.label].indexOf(this.filterValue) !== -1);
		} else {
			this.items = this.unfilteredItems.filter(item =>
				Object.keys(item).some(k => item[k] != null &&
					item[k].toString().toLowerCase()
						.includes(this.filterValue.toLowerCase()))
			);
		}
	}

	selectOption(item: Object | Object[]): void {
		if (!this.multiple) {
			this.isSelectOpened = false;
			this.selectedItem = item;
		} else {
			if (!this.selectedItem) {
				this.selectedItem = [];
			}

			let isSelect = true;
			this.selectedItem.some((selectedItem, index) => {
				if (item[this.value] === selectedItem[this.value]) {
					isSelect = false;

					this.selectedItem.splice(index, 1);

					if (this.selectedItem.length === 0) {
						this.selectedItem = null;
					}

					return;
				}
			});

			if (isSelect) {
				this.selectedItem.push(item);
			}
		}

		this.propagateChange(this.selectedItem.id);
		this.onSelect.emit(this.selectedItem.id);
	}

	openDropdown(): void {
		this.isSelectOpened = !this.isSelectOpened;
		setTimeout(() => this.filterElement.nativeElement.focus(), 0);
	}

	checkIsSelected(item: any): boolean {
		if (!this.selectedItem) {
			return;
		}

		if (!this.multiple) {
			return item === this.selectedItem;
		}

		let isSelected = false;
		this.selectedItem.some(selectedItem => {
			if (selectedItem[this.value] === item[this.value]) {
				isSelected = true;
				return;
			}
		});

		return isSelected;
	}

	ngOnChanges() {
    console.log(this.items.length + ':' + this.selectedItem)
    if (this.selectedItem && this.selectedItem !== 'object') {
      this.setSelectedItemObject(this.selectedItem);
    }
  }

	getLabel(item: string): string {
		if (!isArray(this.label)) {
			return item[this.label];
		}

		let labels = '';
		for (const i in this.label) {
			labels += item[this.label[i]] + ' - ';
		}

		return labels.slice(0, -3);
	}

  private setSelectedItemObject(value: any): boolean {
	  return this.items.some(item => {
      if (value.toString() === item[this.value].toString()) {
        this.selectedItem = item;
        return true;
      }
    });
  }

	writeValue(value: any): void {
    if (value && value !== 'object') {
      if (!this.setSelectedItemObject(value)) {
        this.selectedItem = value;
      }
    } else {
      this.selectedItem = value;
    }
	}

	registerOnChange(fn: any) {
		this.propagateChange = fn;
  }

	registerOnTouched(fn: any): void {
	}

	setDisabledState(isDisabled: boolean): void {

	}
}
