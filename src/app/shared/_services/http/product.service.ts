import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Company } from 'app/shared/_models/company.model';

@Injectable()
export class ProductService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/products';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getCompanies(): Promise<Company[]> {
    return this.http.get(this.endPoint + '/companies')
    .toPromise()
    .then(response => response as Company[])
    .catch(() => []);
  }
}
