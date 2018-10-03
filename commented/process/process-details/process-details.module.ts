import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProcessDetailsComponent } from './process-details.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommatizeNumberModule } from "../../../shared/_pipes/commatize-number.module";

@NgModule({
  imports: [CommonModule, RouterModule,MatTooltipModule,CommatizeNumberModule],
  exports: [ProcessDetailsComponent],
  declarations: [ProcessDetailsComponent]
})
export class ProcessDetailsModule {}
