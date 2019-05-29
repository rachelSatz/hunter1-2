import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Company } from 'app/shared/_models/company.model';
import {AllProducts, ExtendedProduct, RedirectedProduct} from 'app/shared/_models/product.model';
import { Observable } from 'rxjs';
import {DataTableCriteria} from '../../data-table/classes/data-table-criteria';
import {DataTableResponse} from '../../data-table/classes/data-table-response';

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

  getAllProducts(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const request = this.getTokenHeader();
    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }
    return this.http.get(this.endPoint + '/allProducts', request)
      .toPromise()
      .then(response => response as DataTableResponse)
      .catch(() => null);
  }

  getProduct(id: number): Promise<ExtendedProduct> {
    return this.http.get(this.endPoint + '/' + id, this.getTokenHeader())
      .toPromise()
      .then(response => response as ExtendedProduct);
  }

  // updateProduct(id: number, product: ExtendedProduct): Promise<boolean> {
  //   return this.http.post(this.endPoint + '/' + id + '/updateProduct', product, this.getTokenHeader())
  //     .toPromise()
  //     .then(response =>  response as boolean);
  // }
  //
  // saveProduct(product: ExtendedProduct): Promise<boolean> {
  //   return this.http.post(this.endPoint + '/saveProduct', product, this.getTokenHeader())
  //     .toPromise()
  //     .then(response =>  response as boolean);
  // }

  createUpdateProduct(id: number, product: ExtendedProduct): Promise<any> {
    if (id === 0) {
      return this.http.post(this.endPoint + '/' + id + '/createUpdateProduct', product, this.getTokenHeader())
        .toPromise()
        .then(response => response);
    } else {
      return this.http.put(this.endPoint + '/' + id + '/createUpdateProduct', product, this.getTokenHeader())
        .toPromise()
        .then(response => response);
    }
  }

  getFullCompanies(): Observable<Company[]> {
    return this.http.get(this.endPoint + '/fullCompany', this.getTokenHeader())
          .map((response: Response) => response as any);
  }

  getRedirectedProduct(productId: number): Promise<RedirectedProduct[]> {
    return this.http.get(this.endPoint + '/' + productId + '/getRedirectedTo', this.getTokenHeader())
      .toPromise()
      .then(response => response as RedirectedProduct[])
      .catch(() => []);
  }

  getProductsList(): Promise<AllProducts[]> {
    const request = this.getTokenHeader();

    return this.http.get(this.endPoint + '/getProductsList', request)
      .toPromise()
      .then(response => response as AllProducts[])
      .catch(() => []);
  }

  addRedirectedProduct(redirectedId: string, productId: number): Promise<any> {
    return this.http.post(this.endPoint + '/' + productId + '/redirectTo',
      {redirectedId: redirectedId}, this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }

  deleteRedirectedProduct(productId: number, redirectedProductCode: string): Promise<any> {
    return this.http.post(this.endPoint  + '/removeRedirected', {productId: productId, code: redirectedProductCode}
       , this.getTokenHeader())
      .toPromise()
      .then(response => response);
  }
}
