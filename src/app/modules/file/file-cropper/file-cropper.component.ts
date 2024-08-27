import { Component } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-file-cropper',
  templateUrl: './file-cropper.component.html',
  styleUrl: './file-cropper.component.scss'
})
export class FileCropperComponent {
	croppedDataUrl: string;
	dataUrl: string;
	width: number;
	height: number;
	uploadImage: (croppedDataUrl: string) => void;
	close: () => void;
	imageCropped(event: ImageCroppedEvent) {
		this.croppedDataUrl = event.base64 as string;
	}
}
