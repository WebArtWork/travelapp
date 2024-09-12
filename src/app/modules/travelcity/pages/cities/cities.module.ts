import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { CitiesComponent } from './cities.component';
import { Routes, RouterModule } from '@angular/router';
import { CitiesDistanceComponent } from './cities-distance/cities-distance.component';

const routes: Routes = [{
	path: '',
	component: CitiesComponent
}];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CoreModule
	],
	declarations: [
		CitiesComponent,
  CitiesDistanceComponent
	],
	providers: []

})

export class CitiesModule { }
