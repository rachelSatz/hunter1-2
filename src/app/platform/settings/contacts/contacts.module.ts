import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ContactsComponent } from './contacts.component';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ContactService } from 'app/shared/_services/http/contact.service';

const routes: Routes = [
  { path: '', component: ContactsComponent },
  { path: 'form', loadChildren: 'app/platform/settings/contacts/contact-form/contact-form.module#ContactFormModule' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  declarations: [ContactsComponent],
  providers: [ContactService, NotificationService]
})
export class ContactsModule {}
