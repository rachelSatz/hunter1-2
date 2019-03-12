import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ExtendedProduct} from '../_models/product.model';
import {PlanService} from '../_services/http/plan.service';
import {Plan} from '../_models/plan';

@Injectable()
export class PlanResolve implements Resolve<Plan> {

  constructor(private planService: PlanService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.planService.getPlan(+snapshot.params.id).then(response => response as Plan);
  }
}
