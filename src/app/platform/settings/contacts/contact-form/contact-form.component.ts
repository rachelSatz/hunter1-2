import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { AgentService } from 'app/shared/_services/http/agent.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { ProductService } from 'app/shared/_services/http/product.service';

import { Contact, EntityTypes } from 'app/shared/_models/contact.model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
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

  hasServerError: boolean;

  entities = [];
  contact = new Contact;

  entityTypes = Object.keys(EntityTypes).map(function(e) {
    return { id: e, name: EntityTypes[e] };
  });

  constructor(private route: ActivatedRoute, private router: Router,
              private contactService: ContactService, private agentService: AgentService,
              private productService: ProductService) {}

  ngOnInit() {
    if (this.route.snapshot.data.contact) {
      this.contact = this.route.snapshot.data.contact;
    }

    if (this.contact.id) {
      this.loadEntities(this.contact.type);
    }
  }

  loadEntities(type: string): void {
    if (type === 'agent') {
      // this.agentService.getEmployerAgents();
      this.entities = [];
    }

    if (type === 'company') {
      this.productService.getCompanies().then(response => this.entities = response);
    }
  }

  submit(form: NgForm): void {
    this.hasServerError = false;

    if (form.valid) {
      if (this.contact.id) {
        this.contactService.updateContact(form.value, this.contact.id).then(response => this.handleResponse(response));
      } else {
        this.contactService.newContact(form.value).then(response => this.handleResponse(response));
      }
    }
  }

  private handleResponse(isSaved: boolean): void {
    if (isSaved) {
      this.router.navigate(['platform', 'settings', 'contacts']);
    } else {
      this.hasServerError = true;
    }
  }
}
