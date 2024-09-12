import { Component } from '@angular/core';
import { FormService } from 'src/app/modules/form/form.service';
import {
	TravelcityService,
	Travelcity
} from '../../services/travelcity.service';
import { AlertService, CoreService } from 'wacom';
import { TranslateService } from 'src/app/modules/translate/translate.service';
import { FormInterface } from 'src/app/modules/form/interfaces/form.interface';

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
		create: () => {
			this._form.modal<Travelcity>(this.form, {
				label: 'Create',
				click: (created: unknown, close: () => void) => {
					this._st.create(created as Travelcity);
					close();
				}
			});
		},
		update: (doc: Travelcity) => {
			this._form
				.modal<Travelcity>(this.form, [], doc)
				.then((updated: Travelcity) => {
					this._core.copy(updated, doc);
					this._st.update(doc);
				});
		},
		delete: (doc: Travelcity) => {
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
						callback: () => {
							this._st.delete(doc);
						}
					}
				]
			});
		}
	};

	get rows(): Travelcity[] {
		return this._st.travelcitys;
	}

	constructor(
		private _translate: TranslateService,
		private _alert: AlertService,
		private _st: TravelcityService,
		private _form: FormService,
		private _core: CoreService
	) {}
}
