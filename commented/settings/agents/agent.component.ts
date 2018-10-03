import { Component, OnInit } from '@angular/core';
import { DataTableComponent } from "../../../shared/data-table/data-table.component";
import { ActivatedRoute } from "@angular/router";
import { GeneralHttpService } from "../../../shared/_services/http/general-http.service";
import { DataTableHeader } from "../../../shared/data-table/classes/data-table-header";
import { Agent } from "../../../shared/_models/Agent.model";


@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
 styleUrls: ['../../../shared/data-table/data-table.component.css']
})

 

export class AgentComponent extends DataTableComponent implements OnInit {
 readonly headers: DataTableHeader[] = [
    { column: 'name', label: 'שם מלא' }, { column: 'Agentid', label: 'מספר סוכן' },
    { column: 'phoneNumber', label: 'מס טלפון' }, { column: 'email', label: 'כתובת מייל' },
    { column: 'address', label: 'כתובת' }, { column: 'fax', label: 'פקס' }, { column: 'remarks', label: 'הערות' }
  ];
  agents: Agent[] = [];
  newAgent: Agent;
  constructor(protected route: ActivatedRoute, private generalService: GeneralHttpService ) { 
       super(route);
  }

  ngOnInit() {

    if (sessionStorage.getItem('new-agent')) {
      this.newAgent = JSON.parse(sessionStorage.getItem('new-agent'));
      sessionStorage.removeItem('new-agent');
    }
        super.ngOnInit();
  }
  fetchItems(): void {
    this.generalService.getAgents().then(response => this.setItems(response));
  }
}
