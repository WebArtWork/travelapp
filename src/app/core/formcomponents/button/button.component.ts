import { Component } from '@angular/core';
@Component({
	selector: 'button-formcomponents',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
	get disableSubmit(): boolean {
		return typeof this.field.Submit === 'boolean'
			? !this.field.Submit
			: true;
	}
	field: any = {};
	click() {
		if (typeof this.field.Click === 'function') {
			this.field.Click();
		}
	}
}
