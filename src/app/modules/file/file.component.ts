import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FileService } from './file.service';
import { HttpService } from 'wacom';
import { ModalService } from '../modal/modal.service';
import { FileCropperComponent } from './file-cropper/file-cropper.component';

@Component({
	selector: 'ngx-file',
	templateUrl: './file.component.html',
	styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {
	@Input() container = 'general';
	@Input() name = '';
	@Input() err = '';
	@Input() label = '';
	@Input() class = '';
	@Input() imgStyle = {};
	@Input() multiple = false;
	@Input() isPhoto = false;
	@Input() isRound = false;
	@Input() resize: number;
	@Input() width: number;
	@Input() height: number;
	@Input() value: string | string[] = this.multiple ? [] : '';
	@Output() update = new EventEmitter();
	force = '';

	get files(): string[] {
		return this.value as string[];
	}

	constructor(
		private _modal: ModalService,
		private _http: HttpService,
		private _fs: FileService
	) {}

	ngOnInit(): void {
		if (!this.name && !this.multiple && this.value) {
			const paths = ((this.value as string) || '').split('/');
			this.name = paths[paths.length - 1].split('?')[0];
		}
	}

	set() {
		this._fs.setFile = (dataUrl: string) => {
			if (this.width && this.height) {
				this._modal.show({
					uploadImage: this.uploadImage.bind(this),
					component: FileCropperComponent,
					width: this.width,
					height: this.height,
					dataUrl
				});
			} else {
				this.uploadImage(dataUrl);
			}
		};
	}

	uploadImage(dataUrl: string) {
		this._http.post(
			'/api/file/photo',
			{
				container: this.container,
				name: this.name,
				dataUrl
			},
			(url) => {
				if (this.multiple) {
					if (!this.value) {
						this.value = [];
					}

					(this.value as string[]).push(url);
				} else {
					this.name = url.split('/')[5].split('?')[0];

					this.value = url;
				}

				this.update.emit(this.value);
			}
		);
	}
}
