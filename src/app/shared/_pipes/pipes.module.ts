import { NgModule } from '@angular/core';

import { FilterItemsPipe } from './filter-items.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import { TruncatePipe } from './truncate.pipe';

@NgModule({
	declarations: [FilterItemsPipe, SafeUrlPipe, TruncatePipe],
	exports: [FilterItemsPipe, SafeUrlPipe, TruncatePipe]
})
export class PipesModule {}
