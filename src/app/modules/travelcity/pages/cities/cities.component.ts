import { Component } from '@angular/core';
import { FormService } from 'src/app/modules/form/form.service';
import {
	TravelcityService,
	Travelcity
} from '../../services/travelcity.service';
import { AlertService, CoreService } from 'wacom';
import { TranslateService } from 'src/app/modules/translate/translate.service';
import { FormInterface } from 'src/app/modules/form/interfaces/form.interface';
import { ModalService } from 'src/app/modules/modal/modal.service';
import { CitiesDistanceComponent } from './cities-distance/cities-distance.component';

@Component({
	templateUrl: './cities.component.html',
	styleUrls: ['./cities.component.scss']
})
export class CitiesComponent {
	columns = ['name', 'short'];

	form: FormInterface = this._form.getForm('cities', {
		formId: 'cities',
		title: 'Cities',
		components: [
			{
				name: 'Text',
				key: 'name',
				focused: true,
				fields: [
					{
						name: 'Placeholder',
						value: 'fill city title'
					},
					{
						name: 'Label',
						value: 'Title'
					}
				]
			},
			{
				name: 'Text',
				key: 'short',
				fields: [
					{
						name: 'Placeholder',
						value: 'fill city short'
					},
					{
						name: 'Label',
						value: 'Short'
					}
				]
			}
		]
	});

	config = {
		create: (): void => {
			this._form.modal<Travelcity>(this.form, {
				label: 'Create',
				click: (created: unknown, close: () => void) => {
					this._st.create(created as Travelcity);

					close();
				}
			});
		},
		update: (doc: Travelcity): void => {
			this._form
				.modal<Travelcity>(this.form, [], doc)
				.then((updated: Travelcity) => {
					this._core.copy(updated, doc);

					this._st.update(doc);
				});
		},
		delete: (doc: Travelcity): void => {
			this._alert.question({
				text: this._translate.translate(
					'Common.Are you sure you want to delete this cservice?'
				),
				buttons: [
					{
						text: this._translate.translate('Common.No')
					},
					{
						text: this._translate.translate('Common.Yes'),
						callback: (): void => {
							this._st.delete(doc);
						}
					}
				]
			});
		},
		buttons: [
			{
				icon: 'place',
				click: (city: Travelcity): void => {
					this._modal.show({
						component: CitiesDistanceComponent,
						city
					});
				}
			}
		]
	};

	get rows(): Travelcity[] {
		return this._st.travelcities;
	}

	constructor(
		private _translate: TranslateService,
		private _st: TravelcityService,
		private _alert: AlertService,
		private _modal: ModalService,
		private _form: FormService,
		private _core: CoreService
	) {}
}
