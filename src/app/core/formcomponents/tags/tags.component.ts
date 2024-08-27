import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
	selector: 'tags-formcomponents',
	templateUrl: './tags.component.html',
	styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements AfterViewInit {
	@ViewChild('inputRef', { static: false }) inputRef: any;

	field: any = {};
	config: any = {};
	component: any = {};
	control: FormControl;
	form: FormGroup;
	value: string[];

	tags: string[] = [];
	addTag() {
		this.tags.push(this.inputRef.formControl.value.replace('\n', ''));
		this.inputRef.formControl.setValue('');
		this.update();
		setTimeout(() => {
			this.inputRef.inputEl.nativeElement.focus();
		}, 100);
	}

	ngAfterViewInit() {
		this.tags = this.value || this.tags;
	}

	update() {
		this.control.setValue(this.tags);
	}
}
