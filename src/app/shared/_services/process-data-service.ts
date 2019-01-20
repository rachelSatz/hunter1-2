import { Injectable } from '@angular/core';

import { Process } from '../_models/process.model';

@Injectable()
export class ProcessDataService {
  activeProcess: Process;

  setProcess(data: Object): void {
    this.activeProcess = new Process();
    this.activeProcess.pageNumber = data['pageNumber'];
    this.activeProcess.year = data['year'];
    this.activeProcess.month = data['month'];
    this.activeProcess.monthName = data['monthName']
    this.activeProcess.name = data['processName'];
    this.activeProcess.type = data['type'];
    this.activeProcess.processID = data['processId'];
    this.activeProcess.departmentId = data['departmentId'];
    this.activeProcess.isDirect = data['isDirect'];
    this.activeProcess.file = data['file'];
    this.activeProcess.pageIndex = 2;
    this.activeProcess.returnDetails = data['returnDetails'];
  }
}

