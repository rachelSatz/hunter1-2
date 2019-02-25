import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { AgentService } from 'app/shared/_services/http/agent.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { ProductService } from 'app/shared/_services/http/product.service';
import { Contact, EntityTypes } from 'app/shared/_models/contact.model';
import { NotificationService } from 'app/shared/_services/notification.service';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  animations: [ fade ]
})
export class ContactFormComponent implements OnInit {

  hasServerError: boolean;

  entities = [];
  contact = new Contact;

  entityTypes = Object.keys(EntityTypes).map(function(e) {
    return { id: e, name: EntityTypes[e] };
  });



  constructor(private route: ActivatedRoute, private router: Router,
              private contactService: ContactService,
              private agentService: AgentService,
              private productService: ProductService,
              private selectUnit: SelectUnitService,
              protected notificationService: NotificationService) {}

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
        if (this.selectUnit.currentEmployerID) {
          this.contactService.newContact(form.value, this.selectUnit.currentEmployerID).
          then(response => this.handleResponse(response));
        }else {
          this.notificationService.error('יש לבחור מעסיק.', 'יש לבחור מעסיק');
        }
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
