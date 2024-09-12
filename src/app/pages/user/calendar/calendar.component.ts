import { Component, HostListener, OnInit } from '@angular/core';
import {
	Travelappointment,
	TravelappointmentService
} from '../../../core/services/travelappointment.service';
import { TranslateService } from '../../../modules/translate/translate.service';
import { FormService } from '../../../modules/form/form.service';
import { FormInterface } from '../../../modules/form/interfaces/form.interface';
import { AlertService } from '../../../modules/alert/alert.service';

@Component({
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
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
	constructor(
		private _tas: TravelappointmentService,
		private _translate: TranslateService,
		private _alert: AlertService,
		private _form: FormService
	) {
		this._onMonthChange();

		this.onResize();
	}
	// Appointment management
	tad = this._tas.travelappointmentsByDate; // object with array's of appointments
	form: FormInterface = this._form.getForm('travelappointment', {
		formId: 'travelappointment',
		title: 'Appointment',
		components: [
			{
				name: 'Text',
				key: 'from',
				focused: true,
				fields: [
					{
						name: 'Placeholder',
						value: 'fill from city'
					},
					{
						name: 'Label',
						value: 'From City'
					}
				]
			},
			{
				name: 'Text',
				key: 'fromTime',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill from time'
					},
					{
						name: 'Label',
						value: 'From Time'
					}
				]
			},
			{
				name: 'Text',
				key: 'fromHref',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill from href'
					},
					{
						name: 'Label',
						value: 'From Href'
					}
				]
			},
			{
				name: 'Text',
				key: 'to',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill to city'
					},
					{
						name: 'Label',
						value: 'To City'
					}
				]
			},
			{
				name: 'Text',
				key: 'toHref',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill to href'
					},
					{
						name: 'Label',
						value: 'To Href'
					}
				]
			},
			{
				name: 'Text',
				key: 'toTime',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill to time'
					},
					{
						name: 'Label',
						value: 'To Time'
					}
				]
			},
			{
				name: 'Text',
				key: 'phone',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill phone'
					},
					{
						name: 'Label',
						value: 'To Phone'
					}
				]
			}
		]
	});
	createAppointment(date: string): void {
		const submition = {
			year: Number(date.split('.')[0]),
			month: Number(date.split('.')[1]),
			day: Number(date.split('.')[2])
		};

		this._form
			.modal<Travelappointment>(
				this.form,
				{
					label: 'Create',
					click: (created: unknown, close: () => void) => {
						this._tas.create(
							{
								...submition,
								...(created as object)
							} as Travelappointment,
							{
								alert: this._translate.translate(
									'Travel.Appointment has been created'
								),
								callback: () => {
									close();
								}
							}
						);
					}
				},
				submition
			)
			.then(this._tas.create.bind(this));
	}
	updateAppointment(appointment: Travelappointment): void {
		this._form.modal<Travelappointment>(
			this.form,
			[
				{
					label: this._translate.translate('Common.Delete'),
					class: 'left',
					click: (updated: unknown, close: () => void) => {
						close();
						this._alert.question({
							text: this._translate.translate(
								'Common.Are you sure you want to delete this appointment?'
							),
							buttons: [
								{
									text: this._translate.translate('Common.No')
								},
								{
									text: this._translate.translate(
										'Common.Yes'
									),
									callback: () => {
										this._tas.delete(
											{
												...appointment
											} as Travelappointment,
											{
												alert: this._translate.translate(
													'Travel.Appointment has been deleted'
												)
											}
										);
									}
								}
							]
						});
					}
				},
				{
					label: this._translate.translate('Common.Update'),
					class: 'right',
					click: (updated: unknown, close: () => void) => {
						this._tas.update(
							{
								...appointment,
								...(updated as object)
							} as Travelappointment,
							{
								alert: this._translate.translate(
									'Travel.Appointment has been updated'
								),
								callback: () => {
									close();
								}
							}
						);
					}
				}
			],
			appointment
		);
	}
	// Calendar management
	currentMonth = new Date().getMonth();
	currentYear = new Date().getFullYear();
	previousMonth: number;
	previousYear: number;
	nextMonth: number;
	nextYear: number;
	setNow(): void {
		this.currentMonth = new Date().getMonth();

		this.currentYear = new Date().getFullYear();

		this._onMonthChange();
	}
	setPreviousMonth(): void {
		this.currentMonth--;
		if (this.currentMonth === -1) {
			this.currentMonth = 11;

			this.currentYear--;
		}

		this._onMonthChange();
	}
	setNextMonth(): void {
		this.currentMonth++;
		if (this.currentMonth === 12) {
			this.currentMonth = 0;

			this.currentYear++;
		}

		this._onMonthChange();
	}
	weeksInMonth: number[] = [];
	startDay = 0; // date of previous month, first in first row, -1
	skipDays = 0; // skipped days on first row
	keepDays = 0; // days on latest row
	private _onMonthChange() {
		if (this.currentMonth === 11) {
			this.previousMonth = 10;
			this.previousYear = this.currentYear;
			this.nextMonth = 0;
			this.nextYear = this.currentYear + 1;
		} else if (this.currentMonth === 0) {
			this.previousMonth = 11;
			this.previousYear = this.currentYear - 1;
			this.nextMonth = 1;
			this.nextYear = this.currentYear;
		} else {
			this.previousMonth = this.currentMonth - 1;
			this.previousYear = this.currentYear;
			this.nextMonth = this.currentMonth + 1;
			this.nextYear = this.currentYear;
		}

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

		this.skipDays =
			(firstDayOfMonth.getDay() === 0 ? 7 : firstDayOfMonth.getDay()) - 1;

		const daysInPreviousMonth =
			this.currentMonth > 1
				? this.getDaysInMonth(this.currentMonth - 1, this.currentYear)
				: this.getDaysInMonth(11, this.currentYear - 1);

		const daysInMonth = this.getDaysInMonth(
			this.currentMonth,
			this.currentYear
		);

		this.startDay = daysInPreviousMonth - this.skipDays;

		this.keepDays = (daysInMonth + this.skipDays) % 7;

		this.selectedDate = '';
	}
	isMobile: boolean;
	@HostListener('window:resize') onResize() {
		this.isMobile = window.innerWidth <= 768;
	}
	date(year: number, month: number, day: number, join = '.'): string {
		return `${year}${join}${month}${join}${day}`;
	}
	selectedDate: string;
	dateClicked(date: string): void {
		if (this.isMobile) {
			this.selectedDate = date;
		} else {
			this.createAppointment(date);
		}
	}
	eventClicked(event: Travelappointment) {
		if (this.isMobile) {
			this.selectedDate = this._tas.date(event);
		} else {
			this.updateAppointment(event);
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
	getDaysInMonth(month: number, year: number): number {
		return new Date(year, month + 1, 0).getDate();
	}
}
