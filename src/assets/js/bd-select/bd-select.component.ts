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
import { isArray } from 'rxjs/util/isArray';
import { placeholder, slideToggle } from 'app/shared/_animations/animation';

@Component({
  selector: 'bd-select' ,
  templateUrl: './bd-select.component.html',
  styleUrls: ['./bd-select.component.css'],
  animations: [ slideToggle, placeholder],
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
  @Input() clientSideSearch = true;
  @Input() searchableProperties = false;
  @Input() error = false;

  @Output() onSelect: EventEmitter<Object | Object[]> = new EventEmitter();
  @Output() onDeselect: EventEmitter<boolean> = new EventEmitter();
  @Output() onScroll: EventEmitter<boolean> = new EventEmitter();
  @Output() serverFilter: EventEmitter<string> = new EventEmitter();

  @Input() @HostBinding('style.width') width = '100%';

  @ViewChild('filterValueEle') filterElement: ElementRef;
  @ViewChild('optionsEle') optionsElement: ElementRef;

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
    if (this.clientSideSearch) {
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
    } else {
      // event.target.parentElement.parentElement.id
       this.serverFilter.emit( this.filterValue);
    }
  }

  selectOption(item: Object | Object[]): void {

    let output;

    if (!this.multiple) {
      this.selectedItem = item;
      this.isSelectOpened = false;

      output = this.selectedItem[this.value];
    }

    if (this.multiple) {
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

      if (this.selectedItem != null) {
        output = this.selectedItem.map(outputItem => {
          return outputItem[this.value] ? outputItem[this.value] : outputItem;
        });
      }
    }

    this.propagateChange(output);
    this.onSelect.emit(output);
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
    if (this.selectedItem) {
      this.setSelectedItem(this.selectedItem);
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

  private setSelectedItem(value: any): boolean {
    if (this.multiple) {
       this.setSelectedItemMultiple(value);
       return true;
    } else {
      return this.items.some(item => {
        if (value.toString() === item[this.value].toString()) {
          this.selectedItem = item;
          this.onSelect.emit(item[this.value]);
          return true;
        }
      });
    }
  }

  setSelectedItemMultiple(values: any[]): void {
    const items = [];
    this.items.forEach(item => {
      const iteratedItem = item[this.value].toString();
      if (values.indexOf(iteratedItem) !== -1) {
         items.push(iteratedItem);
         if (this.selectedItem) {
           this.selectedItem = this.selectedItem.filter(outputItem => {
             if (outputItem[this.value]) {
               return outputItem[this.value];
             }
           });
         }else {
           this.selectedItem = [];
         }
         this.selectedItem.push(item);
      }
    });
    if ( this.items.length === 0) {
      this.selectedItem = values;
    }

    this.onSelect.emit(items);
  }

  writeValue(value: any): void {
  // && typeof value !== 'object'
    if (value ) {
      if (!this.setSelectedItem(value)) {
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
