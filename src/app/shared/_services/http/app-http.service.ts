import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    .then(response => console.log(response))
    .catch(response => console.log(response));
  }
}
