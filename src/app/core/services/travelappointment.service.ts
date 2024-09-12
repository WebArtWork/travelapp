import { Injectable } from '@angular/core';
import {
	AlertService,
	CoreService,
	HttpService,
	StoreService,
	CrudService,
	CrudDocument
} from 'wacom';

export interface Travelappointment extends CrudDocument {
	from: string;
	fromHref: string;
	fromTime: string;
	to: string;
	toHref: string;
	toTime: string;
	day: number;
	month: number;
	year: number;
}

@Injectable({
	providedIn: 'root'
})
export class TravelappointmentService extends CrudService<Travelappointment> {
	travelappointments: Travelappointment[] = [];

	travelappointmentsByDate: Record<string, Travelappointment[]> = {};

	constructor(
		_http: HttpService,
		_store: StoreService,
		_alert: AlertService,
		_core: CoreService
	) {
		super(
			{
				name: 'travelappointment'
			},
			_http,
			_store,
			_alert,
			_core
		);

		this.get().subscribe((travelappointments: Travelappointment[]) => {
			this.travelappointments.push(...travelappointments);
			travelappointments.forEach((ap) => {
				const date = this.date(ap);

				this.travelappointmentsByDate[date] =
					this.travelappointmentsByDate[date] || [];

				this.travelappointmentsByDate[date].push(ap);
			});
		});

		_core
			.on('travelappointment_create')
			.subscribe((travelappointment: Travelappointment) => {
				this.travelappointments.push(travelappointment);

				const date = this.date(travelappointment);

				this.travelappointmentsByDate[date] =
					this.travelappointmentsByDate[date] || [];

				this.travelappointmentsByDate[date].push(travelappointment);
			});

		_core
			.on('travelappointment_delete')
			.subscribe((travelappointment: Travelappointment) => {
				this.travelappointments.splice(
					this.travelappointments.findIndex(
						(o) => o._id === travelappointment._id
					),
					1
				);

				const date = this.date(travelappointment);

				this.travelappointmentsByDate[date].splice(
					this.travelappointmentsByDate[date].findIndex(
						(o) => o._id === travelappointment._id
					),
					1
				);
			});
	}

	date(ap: Travelappointment): string {
		return `${ap.year}${ap.month}${ap.day}`;
	}
}
