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
	description: string;
}

@Injectable({
	providedIn: 'root'
})
export class TravelcityService extends CrudService<Travelcity> {
	travelcitys: Travelcity[] = [];
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
		this.get().subscribe((travelcitys: Travelcity[]) =>
			this.travelcitys.push(...travelcitys)
		);
		_core.on('travelcity_create').subscribe((travelcity: Travelcity) => {
			this.travelcitys.push(travelcity);
		});
		_core.on('travelcity_delete').subscribe((travelcity: Travelcity) => {
			this.travelcitys.splice(
				this.travelcitys.findIndex((o) => o._id === travelcity._id),
				1
			);
		});
	}
}
