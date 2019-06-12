import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MonthlyTransferBlock } from '../_models/monthly-transfer-block';
import { MonthlyTransferBlockService } from '../_services/http/monthly-transfer-block';

@Injectable()
export class EditPaymentResolve implements Resolve<MonthlyTransferBlock> {

  constructor(private monthlyService: MonthlyTransferBlockService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.monthlyService.getMonthly(+route.paramMap.get('id')).then(response => response as MonthlyTransferBlock);
  }
}
