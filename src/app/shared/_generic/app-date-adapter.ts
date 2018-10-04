import { NativeDateAdapter } from '@angular/material';

export class AppDateAdapter extends NativeDateAdapter {
	format(date: Date, displayFormat: Object): string {

		let day = date.getDate().toString();
		if (day.length === 1) {
			day = '0' + day;
		}

		let month = (date.getMonth() + 1).toString();
		if (month.length === 1) {
			month = '0' + month;
		}

		const year = date.getFullYear();

		return day + '/' + month + '/' + year;
	}

	createDate(year: number, month: number, date: number): Date {
		const dateObj = new Date;
		dateObj.setUTCFullYear(year);
		dateObj.setUTCMonth(month);
		dateObj.setUTCDate(date);

		return dateObj;
	}
}
