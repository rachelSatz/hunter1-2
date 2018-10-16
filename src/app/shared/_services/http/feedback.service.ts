import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { BaseHttpService } from './base-http.service';
import { UserSessionService } from '../user-session.service';

import { EmployeeFeedback } from '../../_models/employee-feedback.model';
import { FileFeedback } from '../../_models/file-feedback.model';
import { FileFeedbackError } from '../../_models/file-feedback-error';

@Injectable()
export class FeedbackService extends BaseHttpService {

  readonly endPoint = this.apiUrl + '/feedback';

  constructor(userSession: UserSessionService, private http: HttpClient) {
    super(userSession);
  }

  getEmployeeFeedbacks(searchCriteria?: Object): Promise<EmployeeFeedback[]> {
    const options = this.getTokenHeader();
    options['params'] = searchCriteria;

    
    return this.http.get(this.endPoint + '/employee', options)
    .toPromise()
    .then(response => response as EmployeeFeedback[]);
  }
  getEmployeeFeedbacksApplications(searchCriteria?: Object): Promise<EmployeeFeedback[]> {
    const options = this.getTokenHeader();
    options['params'] = searchCriteria;

    
    return this.http.get(this.endPoint + '/applications', options)
    .toPromise()
    .then(response => response as EmployeeFeedback[]);
  }

  getFileFeedbacks(searchCriteria?: Object): Promise<FileFeedback[]> {
    
    const options = this.getTokenHeader();
    options['params'] = searchCriteria;

    return this.http.get(this.endPoint + '/file', options)
    .toPromise()
    .then(response => response as FileFeedback[]);
  }
  storeComment(fileFeedback: FileFeedback, remark: string): Promise<any[]>  {
  const formData = new FormData;
    formData.append('feedback', JSON.stringify(fileFeedback));
    formData.append('remark', JSON.stringify(remark));
    const options = this.getTokenHeader();
    const body = {
      feedbackFile: fileFeedback,
      remark: remark,

    };

  return this.http.post(this.endPoint  + 'file/' + fileFeedback.id + '/comment', body,
      this.getTokenHeader() )
      .toPromise()
      .then(response => response as any[]);
  }

  getErrorFileFeedbacks(searchCriteria?: Object): Promise<FileFeedbackError[]> {
    const options = this.getTokenHeader();
    options['params'] = searchCriteria;
    
    return this.http.get(this.endPoint + '/errorFile', options)
    .toPromise()
    .then(response => response as FileFeedbackError[]);
  }

  createEmployeeApplication(data: Object, file?: File): Promise<any> {

    const formData = new FormData;
    formData.append('applicationType', data['applicationType']);
    formData.append('feedback', JSON.stringify(data['feedback']));
    formData.append('uploadFile', file);
    formData.append('systemFileIds', JSON.stringify(data['selectedFileIds']));
    formData.append('contactsIds', JSON.stringify(data['selectedContactIds']));
    formData.append('comments', data['comments']);

    return this.http.post(this.endPoint + '/application', formData, this.getTokenHeader())
    .toPromise()
    .then(response => response);
  }

  createFileApplication(feedback: FileFeedback, uplodedFile: File, selectedFileIds: number[],
                        selectedContactsIds: number[], comments: string): Promise<any> {
    
    const formData = new FormData;
    const options = this.getTokenHeader();
    formData.append('feedback', JSON.stringify(feedback));
    formData.append('uploadFile', uplodedFile);
    formData.append('systemFileIds', JSON.stringify(selectedFileIds));
    formData.append('contactsIds', JSON.stringify(selectedContactsIds));
    formData.append('comments', comments);
    return this.http.post(this.endPoint + 'File/application', formData , options)
    .toPromise()
    .then(response => response);
  }



}
