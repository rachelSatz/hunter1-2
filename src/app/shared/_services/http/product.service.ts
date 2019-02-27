import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Company } from 'app/shared/_models/company.model';
import {CompaniesProduct, Product} from 'app/shared/_models/product.model';

@Injectable()
export class ProductService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/products';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getCompanies(): Promise<Company[]> {
    return this.http.get(this.endPoint + '/companies', this.getTokenHeader())
    .toPromise()
    .then(response => response as Company[])
    .catch(() => []);
  }

  getProductTypesByCompany(companyID: number): Promise<string[]> {
    return this.http.get(this.endPoint + '/companyTypes/' + companyID, this.getTokenHeader())
    .toPromise()
    .then(response => response as string[])
    .catch(() => []);
  }

  getAllProducts(searchCriteria?: Object): Promise<CompaniesProduct[]> {
    const request = this.getTokenHeader();
    if (searchCriteria) {
      request['params'] = searchCriteria;
    }

    return this.http.get(this.endPoint + '/allProducts', request)
      .toPromise()
      .then(response => response as CompaniesProduct[])
      .catch(() => null);
  }
}
