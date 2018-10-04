import { forwardRef, NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDatepickerModule, MatNativeDateModule } from '@angular/material';

import { AppDateAdapter } from '../_generic/app-date-adapter';

const APP_DATE_FORMATS = {
	parse: {
		dateInput: { month: 'long', year: 'numeric', day: 'numeric' }
	},
	display: {
		dateInput: 'input',
		monthYearLabel: { year: 'numeric', month: 'numeric' },
		dateA11yLabel: { year: 'numeric', month: 'numeric', day: 'numeric' },
		monthYearA11yLabel: { year: 'numeric', month: 'numeric' }
	}
};

@NgModule({
	imports: [MatDatepickerModule, MatNativeDateModule],
	exports: [MatDatepickerModule, MatNativeDateModule],
	providers: [
		{ provide: DateAdapter, useClass: forwardRef(() => AppDateAdapter) },
		{ provide: MAT_DATE_LOCALE, useValue: 'he-IL' }
	]
})

export class DatePickerModule {}
