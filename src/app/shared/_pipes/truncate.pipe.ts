import { Pipe } from '@angular/core';

@Pipe({
	name: 'truncate'
})
export class TruncatePipe {
	transform(value: string, lengthArg: any, trailArg: string) : string {
		const length = lengthArg ? parseInt(lengthArg) : 10;
		const trail = trailArg ? trailArg : '...';

		return value.length > length ? value.substring(0, length) + trail : value;
	}
}
