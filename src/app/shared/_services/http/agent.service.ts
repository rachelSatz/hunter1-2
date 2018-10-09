import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';
import { Agent } from 'app/shared/_models/agent.model';

@Injectable()
export class AgentService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/agents';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getEmployerAgents(employerID: number): Promise<Agent[]> {
    return this.http.get(this.endPoint + '/byEmployer/' + employerID, this.getTokenHeader())
    .toPromise()
    .then(response => response as Agent[])
    .catch(() => []);
  }
}
