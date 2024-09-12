import { Component } from '@angular/core';
import {
	Travelcity,
	TravelcityService
} from '../../../services/travelcity.service';

@Component({
	selector: 'app-cities-distance',
	templateUrl: './cities-distance.component.html',
	styleUrl: './cities-distance.component.scss'
})
export class CitiesDistanceComponent {
	constructor(public tcs: TravelcityService) {}
	city: Travelcity;
}
