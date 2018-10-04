import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { Compensation } from 'app/shared/_models/compensation.model';

@Injectable()
export class CompensationService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/compensations';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getCompensations(): Promise<Compensation[]> {
    return this.http.get(this.endPoint)
    .toPromise()
    .then(response => response as Compensation[])
    .catch(() => []);
  }
}
