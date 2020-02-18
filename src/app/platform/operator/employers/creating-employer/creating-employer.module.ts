import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CreatingEmployersResolve } from 'app/shared/_resolves/employers.resolve';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';
import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatProgressBarModule,
  MatCheckboxModule
} from '@angular/material';

import { CreatingEmployerComponent } from './creating-employer.component';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { DocumentService } from 'app/shared/_services/http/document.service';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { FileDropModule } from 'ngx-file-drop';
import {MatRadioModule} from '@angular/material/radio';



const routes: Routes = [
  { path: '', component: CreatingEmployerComponent },
  { path: ':id', component: CreatingEmployerComponent, resolve: { items: CreatingEmployersResolve }
  }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    BdSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule, MatProgressBarModule, MatCheckboxModule, FileDropModule, MatRadioModule
  ],
  declarations: [ CreatingEmployerComponent ],
  providers: [
    GeneralHttpService,
    FormBuilder,
    CreatingEmployersResolve,
    ContactService,
    DocumentService,
    ProcessService]
})
export  class CreatingEmployerModule {

}

