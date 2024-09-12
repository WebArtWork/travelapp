import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { CitiesComponent } from './cities.component';
import { Routes, RouterModule } from '@angular/router';

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
		CitiesComponent
	],
	providers: []

})

export class CitiesModule { }
