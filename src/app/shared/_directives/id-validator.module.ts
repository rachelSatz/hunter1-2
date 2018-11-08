import { NgModule } from '@angular/core';

import { IDValidatorDirective } from './id-validator.directive';

@NgModule({
  declarations: [IDValidatorDirective],
  exports: [IDValidatorDirective]
})
export class IdValidatorModule {}
