import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BdSelectComponent } from './bd-select.component';

@NgModule({
	imports: [CommonModule, FormsModule],
	exports: [BdSelectComponent],
	declarations: [BdSelectComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BdSelectModule {}
