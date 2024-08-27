import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'perPage'
})
export class PerPagePipe implements PipeTransform {
	transform(arr: any, config: any, sort: any, reload?: string): any {
		if (!Array.isArray(arr)) return [];
		if (config.perPage === -1) return arr;
		arr = arr.slice();
		for (let i = 0; i < arr.length; i++) {
			arr[i].num = i + 1;
		}
		if (sort.direction) {
			arr.sort((a: any, b: any) => {
				if (a[sort.title] < b[sort.title]) {
					return sort.direction == 'desc' ? 1 : -1;
				}
				if (a[sort.title] > b[sort.title]) {
					return sort.direction == 'desc' ? -1 : 1;
				}
				return 0;
			});
		}
		return arr.slice(
			(config.page - 1) * config.perPage,
			config.page * config.perPage
		);
	}
}
