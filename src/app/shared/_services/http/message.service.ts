import { Injectable } from '@angular/core';
import { BaseHttpService } from 'app/shared/_services/http/base-http.service';
import { UserSessionService } from 'app/shared/_services/user-session.service';
import { HttpClient } from '@angular/common/http';
import { Message } from 'app/shared/_models/message.model';
import { DataTableCriteria } from 'app/shared/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'app/shared/data-table/classes/data-table-response';
import 'rxjs/add/operator/toPromise';
import { Department } from 'app/shared/_models/department.model';


@Injectable()
export class MessageService extends BaseHttpService {
  readonly endPoint = this.apiUrl + '/messages';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getMessage(id: number): Promise<Message> {
    return this.http.get(this.endPoint + '/' + id,  this.getTokenHeader())
      .toPromise().then(response => response as Message);
  }

  getMessages(criteria: DataTableCriteria): Promise<DataTableResponse> {
    const request = this.getTokenHeader();

    if (criteria) {
      request['params'] = this.setDataTableParams(criteria);
    }
    return this.http.get(this.endPoint,  request)
      .toPromise()
      .then(response => response as DataTableResponse);
  }

  delete(id: number): Promise<boolean> {
    return this.http.delete(this.endPoint + '/' + id, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  create(message: Message, uploadedFile?: File[]): Promise<any> {
    const formData = new FormData();

    formData.append('message', JSON.stringify(message));

    if (uploadedFile) {
      for (let i = 0; i <= uploadedFile.length - 1 ; i++) {
        formData.append('file', uploadedFile[i]);
      }
    }
    return this.http.post(this.endPoint, formData, this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  update(message: Message, uploadedFile?: File[]): Promise<any> {
    const formData = new FormData();

    if (uploadedFile) {
      for (let i = 0; i <= uploadedFile.length - 1 ; i++) {
        formData.append('file', uploadedFile[i]);
      }
    }
    return this.http.put(this.endPoint + '/' + message.id, {message: message, files: formData} , this.getTokenHeader())
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  getMessageName(): Promise<any> {
    return this.http.get(this.endPoint + '/getMessageName',  this.getTokenHeader())
      .toPromise().then(response => response as any);
  }

  send(message: Message): Promise<any> {
    return this.http.post(this.endPoint + '/' + message.id +  '/sendMessage', {}, this.getTokenHeader())
      .toPromise()
      .then(response => response)
      .catch(() => null);
  }
}
