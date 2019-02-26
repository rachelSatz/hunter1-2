import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Contact, EntityTypes } from 'app/shared/_models/contact.model';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ProductService } from 'app/shared/_services/http/product.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { fade } from 'app/shared/_animations/animation';
import {NotificationService} from '../../../../../../shared/_services/notification.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styles: ['.operator-container {margin-right: 60px}'],
  animations: [ fade ]
})
export class ContactFormComponent implements OnInit {

  pathEmployers = false;
  contact = new Contact();
  hasServerError: boolean;
  entities = [];
  entityTypes = Object.keys(EntityTypes).map(function(e) {
    return { id: e, name: EntityTypes[e] };
  });

  constructor( private route: ActivatedRoute,
               private selectUnit: SelectUnitService,
               private router: Router,
               private productService: ProductService,
               private contactService: ContactService,
               protected notificationService: NotificationService) {}

  ngOnInit() {
    if (this.router.url.split('/')[3] === 'employers') {
      this.pathEmployers = true;
    }
    if (this.route.snapshot.data.contact) {
      this.contact = this.route.snapshot.data.contact;
    }

    if (this.contact.id) {
      this.loadEntities(this.contact.type);
    }
  }

  loadEntities(type: string): void {
    if (type === 'agent') {
      this.entities = [];
    }

    if (type === 'company') {
      this.productService.getCompanies().then(response => this.entities = response);
    }

    if (type === 'employer') {
      this.contact.entity_id = this.selectUnit.currentEmployerID;
    }
  }

  submit(form: NgForm): void {
    this.hasServerError = false;
    if (this.selectUnit.currentEmployerID !== 0) {
      if (form.valid) {
        if (this.contact.id) {
          this.contactService.updateContact(form.value, this.contact.id)
            .then(response => this.handleResponse(response));
        } else {
          this.contactService.newContact(form.value, this.selectUnit.currentEmployerID)
            .then(response => this.handleResponse(response));
        }
      }
    }else {
      this.notificationService.error( 'יש לבחור מעסיק');
    }
  }

  private handleResponse(response: boolean): void {
    if (response) {
      if (this.router.url.includes( 'operator')) {
        this.router.navigate(['platform', 'operator', 'employers',
          'form', this.selectUnit.currentEmployerID, 'contacts']);
      } else {
        if (this.router.url.includes( 'employers')) {
          this.router.navigate(['platform', 'employers',
            'form', this.selectUnit.currentEmployerID, 'contacts']);
        }else {
          this.router.navigate([ 'platform', 'contacts']);
        }
      }

    } else {
      this.hasServerError = true;
    }
  }
}
