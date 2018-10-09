import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

import { BdSelectModule } from 'app/../assets/js/bd-select/bd-select.module';

import { ContactFormComponent } from './contact-form.component';

import { ProductService } from 'app/shared/_services/http/product.service';
import { AgentService } from 'app/shared/_services/http/agent.service';
import { ContactService } from 'app/shared/_services/http/contact.service';

import { ContactResolve } from 'app/shared/_resolves/contact.resolve';

const routes: Routes = [
  { path: '', component: ContactFormComponent },
  { path: ':id', component: ContactFormComponent, resolve: { contact: ContactResolve } }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    MatFormFieldModule, MatInputModule,
    BdSelectModule
  ],
  declarations: [ContactFormComponent],
  providers: [ContactService, AgentService, ProductService, ContactResolve]
})
export class ContactFormModule {}
