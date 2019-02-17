import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgForm } from '@angular/forms';

import { Contact, EntityTypes } from 'app/shared/_models/contact.model';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ProductService } from 'app/shared/_services/http/product.service';
import { ContactService } from 'app/shared/_services/http/contact.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styles: ['.operator-container {margin-right: 60px}'],
  animations: [
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        height: '0'
      })),
      state('active', style({
        display: '*',
        height: '*'
      })),
      transition('active => inactive', animate('200ms')),
      transition('inactive => active', animate('200ms'))
    ])
  ]
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
               private contactService: ContactService) {}

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
    if (form.valid) {
      if (this.contact.id) {
        this.contactService.updateContact(form.value, this.contact.id)
          .then(response => this.handleResponse(response));
      } else {
          this.contactService.newContact(form.value, this.selectUnit.currentEmployerID)
            .then(response => this.handleResponse(response));
      }
    }
  }

  private handleResponse(response: boolean): void {
    if (response) {
      this.router.navigate(['platform', 'operator', 'employers',
        'form', this.selectUnit.currentEmployerID, 'contacts']);
    } else {
      this.hasServerError = true;
    }
  }
}
