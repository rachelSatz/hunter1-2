import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NotificationService } from 'app/shared/_services/notification.service';
import { DataTableModule } from 'app/shared/data-table/data-table.module';
import { ProductService } from 'app/shared/_services/http/product.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { ContactsComponent } from './contacts.component';

const routes: Routes = [{ path: '', component: ContactsComponent },
  { path: 'form',
    loadChildren: './contact-form/contact-form.module#ContactFormModule'}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DataTableModule
  ],
  declarations: [ContactsComponent],
  providers: [ContactService, ProductService, NotificationService]
})
export class ContactsModule { }
