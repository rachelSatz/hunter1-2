import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { NotificationService, NotificationType } from "../../../../shared/_services/notification.service";
import { Router, ActivatedRoute } from "@angular/router";
import { GeneralHttpService } from "../../../../shared/_services/http/general-http.service";
import { Agent } from "../../../../shared/_models/Agent.model";
import { disableDebugTools } from '../../../../../../node_modules/@angular/platform-browser';


@Component({
  selector: 'app-agent-from',
  templateUrl: './agent-from.component.html',

})
export class AgentFromComponent implements OnInit, OnDestroy{
   paramSubscription: Subscription;
  agentIdUpdateMode = -1;
   isSubmitting: boolean;
  isSuccessful: boolean;
  agent=new Agent();
  constructor(private router: Router, private route: ActivatedRoute, private generalHttp: GeneralHttpService,
              private notificationService: NotificationService) { }

  ngOnInit() {
    
     this.paramSubscription = this.route.params.subscribe(message => {
       debugger;
      if (message['id']) {
          this.agentIdUpdateMode = +message['id'];
          this.generalHttp.getAgent(+message['id']).then(response => {
            this.agent = response;
        
          });
        } else {
          this.agentIdUpdateMode = -1;
       
        }
     });
  }
  submit(isValid: boolean): void {
debugger;
    if (isValid) {
      if ( this.agentIdUpdateMode === -1) {
      this.isSubmitting = true;
      this.generalHttp.newAgent(this.agent).then(
        response => setTimeout(() => this.handleResponse(response), 2000)
      );
      } else {
        this.isSubmitting = true;
        this.generalHttp.updateAgent(this.agent, this.agentIdUpdateMode)
        .then(response => setTimeout(() => {
          this.notificationService.showResult(response ?
            'עדכון הרשומה בוצע בהצלחה' : 'עדכון הרשומה נכשל', response ? NotificationType.success : NotificationType.error);
          this.router.navigate(['/settings/agents']);
        }, 2000));
      }
    }
  }

  private handleResponse(response: Agent): void {

    if (response['id']) {
      sessionStorage.setItem('new-agent', JSON.stringify(response));
      this.router.navigate(['/settings', 'agents']);
    }

    this.isSuccessful = false;
    this.isSubmitting = false;
  }
 ngOnDestroy(): void {
     this.paramSubscription.unsubscribe();
  }


}
