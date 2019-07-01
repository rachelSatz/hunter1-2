// import { comments } from './contact.model';
import { Document } from './document.model';

export class TaskModel {
  id: number;
  created_at: string;
  subject: string;
  description: string;
  status: string;
  due_date: string;
  due_time: string;
  employer_name: string;
  employer_id: number;
  reporter_name: string;
  reporter_id: number;
  assignee_name: string;
  assignee_id: number;
  comments: Comment[] = [];
  documents: Document[] = [];
  employer:  {'id': 0, 'name': ''};
  assignee: {'id': 0, 'name': ''};
  reporter:  {'id': 0, 'name': ''};

  constructor() {
    this.subject = '';
    this.description = '';
    this.due_date = '';
    this.comments.push(new Comment());
    this.documents.push(new Document());
    this.employer = {'id': 0, 'name': ''};
    this.assignee = {'id': 0, 'name': ''};
    this.reporter = {'id': 0, 'name': ''};

  }
}

export class Comment {
  id: number;
  comment: string;

  constructor() {
    this.id = 0;
    this.comment = '';
  }
}
