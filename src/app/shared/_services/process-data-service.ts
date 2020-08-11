import { Injectable } from '@angular/core';

import { Process } from '../_models/process.model';

@Injectable()
export class ProcessDataService {
  activeProcess: Process;

  setProcess(data: Object): void {
    this.activeProcess = new Process();
    this.activeProcess.year = data['year'];
    this.activeProcess.month = data['month'];
    this.activeProcess.monthName = data['monthName'];
    this.activeProcess.name = data['name'];
    this.activeProcess.type = data['type'];
    this.activeProcess.typeProcess = data['typeProcess'];
    this.activeProcess.processID = data['processID'];
    this.activeProcess.departmentId = data['departmentId'];
    this.activeProcess.employer_id = data['employer_id'];
    this.activeProcess.isDirect = data['isDirect'];
    this.activeProcess.file = data['file'];
    this.activeProcess.pageIndex = 2;
    this.activeProcess.returnDetails = data['returnDetails'];
    this.activeProcess.status = data['status'];
    this.activeProcess.highlightFileId = data['highlightFileId'];
    this.activeProcess.highlightRecordId = data['highlightRecordId'];
    this.activeProcess.is_references  = data['is_references'];
    this.activeProcess.payment_instructions = data['payment_instructions'];
    this.activeProcess.status_process = data['status_process'];
    this.activeProcess.rows = data['rows'];
    this.activeProcess.sum = data['sum'];
    this.activeProcess.num_file = data['num_file'];
    this.activeProcess.employer_name =  data['employer_name'];
    this.activeProcess.rows_status =  data['rows_status'];
    this.activeProcess.incorrect =  data['incorrect'];

  }
}

