import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../../../shared/_services/http/general.service';
import { UserSessionService } from '../../../../shared/_services/http/user-session.service';
import { SelectUnitService } from '../../../../shared/_services/select-unit.service';

@Component({
  selector: 'app-remarks',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  comments_emp: any = [];
  comment_emp: string;
  hasServerError: boolean;
  employerID: any;

  constructor(private employerService: GeneralService,
              private employerSession: UserSessionService,
              private selectUnit: SelectUnitService) {}

  ngOnInit() {
    this.selectUnit.setActiveEmployerUrl('remarks');
    this.employerService.getEmployerComments(this.employerSession.getUser().username, this.selectUnit.currentEmployerID )
      .then(response => this.comments_emp = response);

  }
  submit(): void {
    this.hasServerError = false;
    this.employerService.newEmployerComment(this.employerSession.getUser().username, this.comment_emp, this.selectUnit.currentEmployerID)
      .then(response => {
      if (response) {
        window.location.reload();
      } else {
        this.hasServerError = true;
      }
    });
  }
  deleteComment(comment_id: any): void {
    this.employerService.deleteComment(comment_id).then(response => {
      if (response) {
        window.location.reload();
      } else {
        this.hasServerError = true;
      }
    });
  }
}
