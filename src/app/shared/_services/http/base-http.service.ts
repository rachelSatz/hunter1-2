import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'app/../environments/environment';

import { UserSessionService } from '../user-session.service';

@Injectable()
export class BaseHttpService {

  readonly apiUrl = environment.apiUrl;

  constructor(protected userSession?: UserSessionService) {}

  getTokenHeader(): { headers: HttpHeaders } {
    return { headers: this.getTokenHeaders() };
  }

  getTokenHeaders(): HttpHeaders {
    return new HttpHeaders({ 'token': this.userSession.getToken() });
  }

  getBlobOptions(): { headers: HttpHeaders, responseType: 'blob' } {
    return {
      headers: new HttpHeaders({ 'token': this.userSession.getToken() }),
      responseType: 'blob'
    };
  }
}
