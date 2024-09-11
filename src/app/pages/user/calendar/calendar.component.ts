import { Component } from '@angular/core';

@Component({
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
	constructor() {
		this._onMonthChange();
	}
	readonly dayTitle: Record<number, string> = {
		1: 'ПН',
		2: 'ВТ',
		3: 'СР',
		4: 'ЧТ',
		5: 'ПТ',
		6: 'СБ',
		7: 'НД'
	};
	readonly monthTitle: Record<number, string> = {
		0: 'Січень',
		1: 'Лютий',
		2: 'Березень',
		3: 'Квітень',
		4: 'Травень',
		5: 'Червень',
		6: 'Липень',
		7: 'Серпень',
		8: 'Вересень',
		9: 'Жовтень',
		10: 'Листопад',
		11: 'Грудень'
	};
	currentMonth = new Date().getMonth();
	currentYear = new Date().getFullYear();
	setNow(): void {
		this.currentMonth = new Date().getMonth();

		this.currentYear = new Date().getFullYear();

		this._onMonthChange();
	}
	previousMonth(): void {
		this.currentMonth--;
		if (this.currentMonth === -1) {
			this.currentMonth = 11;

			this.currentYear--;
		}

		this._onMonthChange();
	}
	nextMonth(): void {
		this.currentMonth++;
		if (this.currentMonth === 12) {
			this.currentMonth = 0;

			this.currentYear++;
		}

		this._onMonthChange();
	}
	weeksInMonth: number[] = [];
	private _onMonthChange() {
		const firstDayOfMonth = new Date(
			this.currentYear,
			this.currentMonth,
			1
		);
		const firstWeek = this.getWeekNumber(firstDayOfMonth);
		this.weeksInMonth = [];
		const weeks = this.getWeeksInMonth(this.currentMonth, this.currentYear);
		for (let i = 0; i < weeks; i++) {
			this.weeksInMonth.push(firstWeek + i);
		}
	}

	/* move to wacom */
	getWeekNumber(date: Date): number {
		const tempDate = new Date(date.getTime());
		tempDate.setHours(0, 0, 0, 0);
		// Set to nearest Thursday: current date + 4 - current day number, making Thursday day 4
		tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
		const yearStart = new Date(tempDate.getFullYear(), 0, 1);
		// Calculate full weeks to nearest Thursday
		return Math.ceil(
			((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
		);
	}
	getWeeksInMonth(month: number, year: number): number {
		const firstDayOfMonth = new Date(year, month, 1);
		const lastDayOfMonth = new Date(year, month + 1, 0);
		// Get ISO week numbers for the first and last day of the month
		const firstWeek = this.getWeekNumber(firstDayOfMonth);
		let lastWeek = this.getWeekNumber(lastDayOfMonth);
		// Special case: when January 1st is in the last week of the previous year
		if (firstWeek > lastWeek) {
			lastWeek = this.getWeekNumber(new Date(year, 11, 31)); // Get week of the last day of the year
		}
		return lastWeek - firstWeek + 1;
	}
}
