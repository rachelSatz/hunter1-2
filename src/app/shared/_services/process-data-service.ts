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
    this.activeProcess.name = data['processName'];
    this.activeProcess.type = data['type'];
    this.activeProcess.processID = data['processId'];
    this.activeProcess.departmentId = data['departmentId'];
    this.activeProcess.isDirect = data['isDirect'];
    this.activeProcess.file = data['file'];
  }
}

