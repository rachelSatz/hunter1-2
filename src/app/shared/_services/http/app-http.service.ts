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
    .then(response => response)
    .catch(response => response);
  }

  register( password: string, token: string): Promise<any> {
    const headers = new HttpHeaders({ 'token': token });
    return this.http.post(this.apiUrl + '/register',  { password: password }, { headers: headers})
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }

  forgotPassword( username: string, email: string): Promise<any> {
    const request = {params: { username: username, email: email }};

    return this.http.get(this.apiUrl + '/forgotPassword', request)
      .toPromise()
      .then(response => response)
      .catch(response => response);
  }
}
