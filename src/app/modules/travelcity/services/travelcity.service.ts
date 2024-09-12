import { Injectable } from '@angular/core';
import {
	AlertService,
	CoreService,
	HttpService,
	StoreService,
	CrudService,
	CrudDocument
} from 'wacom';

export interface Travelcity extends CrudDocument {
	name: string;
	short: string;
	data: Record<string, unknown>;
}

@Injectable({
	providedIn: 'root'
})
export class TravelcityService extends CrudService<Travelcity> {
	travelcities: Travelcity[] = [];
	constructor(
		_http: HttpService,
		_store: StoreService,
		_alert: AlertService,
		_core: CoreService
	) {
		super(
			{
				name: 'travelcity'
			},
			_http,
			_store,
			_alert,
			_core
		);

		this.get().subscribe((travelcities: Travelcity[]) =>
			this.travelcities.push(...travelcities)
		);

		_core
			.on('travelcity_create')
			.subscribe((travelcity: Travelcity): void => {
				this.travelcities.push(travelcity);
			});

		_core
			.on('travelcity_delete')
			.subscribe((travelcity: Travelcity): void => {
				this.travelcities.splice(
					this.travelcities.findIndex(
						(o) => o._id === travelcity._id
					),
					1
				);
			});
	}
}
