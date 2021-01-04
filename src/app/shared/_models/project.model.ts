export class Project {
  id: number;
  name: string;
  project_group_id: number;

  constructor() {

  }

}
export class ProjectGroup {
  id: number;
  name: string;

  constructor() {
  }
}

export enum PROJECT_GROUP {
  SMARTI= 1,
  MYHR = 2
}
