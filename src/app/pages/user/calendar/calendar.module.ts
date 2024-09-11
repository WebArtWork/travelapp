import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { CalendarComponent } from './calendar.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
	path: '',
	component: CalendarComponent
}];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CoreModule
	],
	declarations: [
		CalendarComponent
	],
	providers: []

})

export class CalendarModule { }
