import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Company } from 'app/shared/_models/company.model';
import {ExtendedProduct} from 'app/shared/_models/product.model';
import {EmployerFinancialDetails} from '../../_models/employer-financial-details.model';

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

  getAllProducts(searchCriteria?: Object): Promise<ExtendedProduct[]> {
    const request = this.getTokenHeader();
    if (searchCriteria) {
      request['params'] = searchCriteria;
    }
    return this.http.get(this.endPoint + '/allProducts', request)
      .toPromise()
      .then(response => response as ExtendedProduct[])
      .catch(() => null);
  }

  getProduct(id: number): Promise<ExtendedProduct> {
    return this.http.get(this.endPoint + '/' + id, this.getTokenHeader())
      .toPromise()
      .then(response => response as ExtendedProduct);
  }

  updateProduct(id: number, product: ExtendedProduct): Promise<boolean> {
    return this.http.post(this.endPoint + '/' + id + '/updateProduct', product, this.getTokenHeader())
      .toPromise()
      .then(response =>  response as boolean);
  }

  saveProduct(product: ExtendedProduct): Promise<boolean> {
    return this.http.post(this.endPoint + '/saveProduct', product, this.getTokenHeader())
      .toPromise()
      .then(response =>  response as boolean);
  }
}
