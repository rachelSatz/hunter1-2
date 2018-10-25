import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  ViewChild,
  OnChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { isArray } from 'rxjs/util/isArray';

@Component({
  selector: 'bd-select',
  templateUrl: './bd-select.component.html',
  styleUrls: ['./bd-select.component.css'],
  animations: [
    trigger('slideToggle', [
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
    ]),
    trigger('placeholder', [
      state('inactive', style({
        fontSize: '*',
        top: '*',
        color: '*',
        fontWeight: 'normal'
      })),
      state('active', style({
        fontSize: '12px',
        top: '-12px',
        color: '#3f51b5',
        fontWeight: 'bold'
      })),
      transition('active => inactive', animate('300ms ease-in')),
      transition('inactive => active', animate('300ms ease-in'))
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

    this.propagateChange(this.selectedItem[this.value]);
    this.onSelect.emit(this.selectedItem[this.value]);
  }

  openDropdown(): void {
    this.isSelectOpened = !this.isSelectOpened;
    setTimeout(() => this.filterElement.nativeElement.focus(), 0);
  }

  checkIsSelected(item: any): boolean {
    if (!this.selectedItem) {
      return false;
    }

    if (!this.multiple) {
      return (item === this.selectedItem);
    }

    return this.selectedItem.some(selectedItem => {
      if (selectedItem[this.value] === item[this.value]) {
        return true;
      }
    });
  }

  ngOnChanges() {
    if (this.selectedItem && typeof this.selectedItem !== 'object') {
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
    if (value && typeof value !== 'object') {
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
