import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';

@Injectable()
export class AppHttpService extends BaseHttpService {
  constructor(private http: HttpClient) {
    super();
  }

  login(username: string, password: string): Promise<any> {
    const data = { username: username, password: password };

    return this.http.post(this.apiUrl + '/login', data)
    .toPromise()
    .then(response => response as any)
    .catch(response => response as any);
  }

  register( password: string, token: string): Promise<any> {
    const headers = new HttpHeaders({ 'token': token });
    return this.http.post(this.apiUrl + '/register',  { password: password }, { headers: headers})
      .toPromise()
      .then(response => response as any)
      .catch(response => response as any);
  }
}
