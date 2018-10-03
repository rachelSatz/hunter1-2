import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSelectModule, MatProgressSpinnerModule } from '@angular/material';
import { Select2Module } from 'ng2-select2';
import { DataTableModule } from '../../shared/data-table/data-table.module';

import { EmployersComponent } from './employers/employers.component';
import { EmployerFormComponent } from './employers/employer-form/employer-form.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeFormComponent } from './employees/employee-form/employee-form.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ContactFormComponent } from './contacts/contact-form/contact-form.component';

import { UserSessionService } from '../../shared/_services/user-session.service';
import { GeneralHttpService } from '../../shared/_services/http/general-http.service';
import { EmployeeService } from '../../shared/_services/http/employee.service';
import { EmployerService } from '../../shared/_services/http/employer.service';
import { ContactService } from '../../shared/_services/http/contact.service';

import { IDValidatorDirective } from '../../shared/_directives/id-validator.directive';
import { AgentComponent } from "./agents/agent.component";
import { AgentFromComponent } from "./agents/agent-from/agent-from.component";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Select2Module,
    MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSelectModule, MatProgressSpinnerModule,
    DataTableModule
  ],
  declarations: [
    EmployerFormComponent, ContactsComponent, EmployeesComponent,
    EmployersComponent, EmployeeFormComponent, IDValidatorDirective, ContactFormComponent, AgentComponent, AgentFromComponent
  ],
  providers: [UserSessionService, GeneralHttpService, EmployeeService, EmployerService, ContactService],
  entryComponents: [EmployeeFormComponent, ContactFormComponent,AgentFromComponent]
})
export class SettingsModule { }
