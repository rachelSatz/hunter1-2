import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {TaskModel} from '../_models/task.model';
import {TaskService} from '../_services/http/task.service';
import {Department} from '../_models/department.model';

@Injectable()
export class TaskResolve implements Resolve<TaskModel> {

  constructor(private taskService: TaskService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.taskService.getTask(+snapshot.params.id).then(response => response as TaskModel);
  }
}
