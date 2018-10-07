import { NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MatDatepickerModule, MatNativeDateModule } from '@angular/material';

import { AppDateAdapter } from '../_generic/app-date-adapter';

@NgModule({
	imports: [MatDatepickerModule, MatNativeDateModule],
	exports: [MatDatepickerModule, MatNativeDateModule],
	providers: [
		{ provide: DateAdapter, useClass: AppDateAdapter },
		{ provide: MAT_DATE_LOCALE, useValue: 'he-IL' }
	]
})

export class DatePickerModule {}
