import { NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MatDatepickerModule, MatNativeDateModule, NativeDateAdapter } from '@angular/material';

import { AppDateAdapter } from '../_generic/app-date-adapter';
// export class MyDateAdapter extends NativeDateAdapter {
//   format(date: Date, displayFormat: Object): string {
//     // if (displayFormat === 'input') {
//       const day = date.getDate();
//       const month = date.getMonth() + 1;
//       const year = date.getFullYear();
//       return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
//     // } else {
//     //   return date.toDateString();
//     // }
//   }
//
//   private _to2digit(n: number) {
//     return ('00' + n).slice(-2);
//   }
// }
@NgModule({
	imports: [MatDatepickerModule, MatNativeDateModule],
	exports: [MatDatepickerModule, MatNativeDateModule],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'he-IL' }
  ]
	// providers: [
		// { provide: DateAdapter, useClass: MyDateAdapter },
    // { provide: MAT_DATE_LOCALE, useValue: 'he-IL' }

  // ]
})

export class DatePickerModule {}


