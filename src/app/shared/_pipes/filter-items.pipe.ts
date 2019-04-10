import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filterItems'
})
export class FilterItemsPipe implements PipeTransform {

	public transform(items: any, searchValue: string, headers?: DataTableHeader[]) {

		if (!items || !searchValue) {
			return items;
		}

		if (headers) {
			return items.filter(item => {
				if (headers) {
					return headers.some(header => {
						let value = item[header.column];

						if (header.searchOptions) {
							if (header.searchOptions.property) {
								value = value[header.searchOptions.property];
							}

							if (header.searchOptions.labels) {
								value = header.searchOptions.labels[value];
							}

							if (!value && header.searchOptions.defaultLabel) {
								value = header.searchOptions.defaultLabel;
							}

						}

						return (value && value.toString().indexOf(searchValue) !== -1);
					});
				}
			});
		}

		return items.filter(item =>
			Object.keys(item).some(k =>
				item[k] && item[k].toString().indexOf(searchValue) !== -1
			)
		);

	}

}
