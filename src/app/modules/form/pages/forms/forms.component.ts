import { Component } from '@angular/core';
import { FormService } from 'src/app/modules/form/form.service';
import { FormInterface } from '../../interfaces/form.interface';
import { TranslateService } from 'src/app/modules/translate/translate.service';
import { AlertService } from 'src/app/modules/alert/alert.service';
import { FormComponentInterface } from '../../interfaces/component.interface';

interface CustomformcomponnetfieldInterface {
	name: string;
	value: string;
}
interface CustomformcomponnetInterface {
	name: string;
	fields: CustomformcomponnetfieldInterface[];
	key?: string;
	components?: CustomformcomponnetInterface[];
}
interface CustomformInterface {
	title: string;
	formId: string;
	active: boolean;
	domain: string;
	components: CustomformcomponnetInterface[];
}

@Component({
	templateUrl: './forms.component.html',
	styleUrls: ['./forms.component.scss']
})
export class FormsComponent {
	columns = ['title', 'components', 'formId', 'active'];
	form: FormInterface = this._form.getForm('form', {
		formId: 'form',
		title: 'Custom form',
		components: [
			{
				name: 'Text',
				key: 'title',
				focused: true,
				fields: [
					{
						name: 'Placeholder',
						value: 'fill title'
					},
					{
						name: 'Label',
						value: 'Title'
					}
				]
			},
			{
				name: 'Select',
				key: 'formId',
				fields: [
					{
						name: 'Placeholder',
						value: 'Select form id'
					},
					{
						name: 'Label',
						value: 'Form ID'
					},
					{
						name: 'Items',
						value: this._form.formIds
					}
				]
			}
		]
	});
	components: FormComponentInterface[] = [];
	formComponents: FormInterface = this._form.getForm('formComponents', {
		formId: 'formComponents',
		title: 'Custom components',
		components: [
			{
				components: this.components
			},
			{
				name: 'Select',
				key: 'addComponent',
				fields: [
					{
						name: 'Placeholder',
						value: 'Select form componnet'
					},
					{
						name: 'Label',
						value: 'Form Component'
					},
					{
						name: 'Value',
						value: 'name',
						skipTranslation: true
					},
					{
						name: 'Items',
						value: this._form.components
					}
				]
			}
		]
	});

	config = {
		create: () => {
			this._form
				.modal<FormInterface>(this.form, {
					label: 'Create',
					click: (created: unknown, close: () => void) => {
						this._form.create(
							created as FormInterface,
							close.bind(this)
						);
					}
				})
				.then(this._form.create.bind(this));
		},
		update: (form: FormInterface) => {
			this._form
				.modal<FormInterface>(
					this.form,
					{
						label: 'Update',
						click: (updated: unknown, close: () => void) => {
							this._form.update(
								updated as FormInterface,
								close.bind(this)
							);
						}
					},
					form
				)
				.then(this._form.update.bind(this));
		},
		delete: (form: FormInterface) => {
			this._alert.question({
				text: this._translate.translate(
					'Common.Are you sure you want to delete this user?'
				),
				buttons: [
					{
						text: this._translate.translate('Common.No')
					},
					{
						text: this._translate.translate('Common.Yes'),
						callback: () => {
							this._form.delete(form);
						}
					}
				]
			});
		},
		buttons: [
			{
				icon: 'text_fields',
				click: (doc: CustomformInterface) => {
					this.components.splice(0, this.components.length);
					const submition: Record<string, unknown> = {
						addComponent: 'Text'
					};

					for (let i = 0; i < doc.components.length; i++) {
						submition['key' + i] = doc.components[i].key as string;
						for (const field of doc.components[i].fields) {
							submition[field.name + i] = field.value as string;
						}
					}
					const remove = (i: number) => {
						this.components.splice(i, 1);
						doc.components.splice(i, 1);
						this._form.save(doc);
					}
					(doc.components || []).forEach((component, index) => {
						this.components.push(
							this._addCustomComponent(
								component.name as string,
								component.fields?.map(
									(f) => f.name
								) as string[],
								this.components.length,
								remove
							)
						);
					});
					this._form
						.modal<CustomformInterface>(
							this.formComponents,
							{
								label: 'Add component',
								click: () => {
									const fields = this._form.components.find(
										(c) =>
											c.name === submition['addComponent']
									)?.fields as string[];
									this.components.push(
										this._addCustomComponent(
											submition['addComponent'] as string,
											fields,
											this.components.length,
											remove
										)
									);
									doc.components.push({
										name: submition[
											'addComponent'
										] as string,
										fields: fields.map((name) => {
											return {
												value: '',
												name
											};
										})
									});
								}
							},
							submition,
							() => {},
							{ size: 'big' }
						)
						.then(() => {
							for (let i = 0; i < doc.components.length; i++) {
								doc.components[i].key = submition[
									'key' + i
								] as string;
								for (const field of doc.components[i].fields) {
									field.value = submition[
										field.name + i
									] as string;
								}
							}
							this._form.save(doc);
						});
				}
			}
		]
	};

	get rows(): FormInterface[] {
		return this._form.customForms;
	}

	constructor(
		private _translate: TranslateService,
		private _alert: AlertService,
		private _form: FormService
	) {}

	private _addCustomComponent(
		component: string,
		fields: string[],
		index: number,
		remove: (i: number)=>void
	): FormComponentInterface {
		const components = [
			{
				name: 'Text',
				key: 'key' + index,
				root: true,
				fields: [
					{
						name: 'Placeholder',
						value: 'fill key'
					},
					{
						name: 'Label',
						value: 'Key'
					}
				]
			},
			...(fields || [])?.map((f) => {
				return {
					name: this._form.customFieldComponent[component + f] || 'Text',
					key: f + index,
					root: true,
					fields: [
						{
							name: 'Placeholder',
							value: 'fill ' + f
						},
						{
							name: 'Label',
							value:
								f.charAt(0).toUpperCase() + f.slice(1, f.length)
						}
					]
				};
			}),
			{
				name: 'Button',
				fields: [
					{
						name: 'Label',
						value: 'Remove'
					},
					{
						name: 'Click',
						value: () => {
							remove(index);
						}
					}
				]
			},
		];
		return {
			class: 'd-f mt10',
			components
		};
	}

	changeStatus(form: FormInterface) {
		setTimeout(() => {
			if (form.active) {
				for (const _form of this._form.customForms) {
					if (_form._id === form._id || _form.formId !== form.formId)
						continue;

					if (_form.active) {
						_form.active = false;

						this._form.save(_form);
					}
				}
			}

			this._form.save(form);
		});
	}
}
