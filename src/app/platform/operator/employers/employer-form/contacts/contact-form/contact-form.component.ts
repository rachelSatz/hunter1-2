import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { NotificationService } from 'app/shared/_services/notification.service';
import { Contact, EntityTypes, Type } from 'app/shared/_models/contact.model';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { ProductService } from 'app/shared/_services/http/product.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { fade } from 'app/shared/_animations/animation';
import { HelpersService } from 'app/shared/_services/helpers.service';
// import { Observable } from 'rxjs';
// import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';


@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styles: ['.operator-container {margin-right: 60px} .disabledInput { pointer-events: none; opacity: 0.4; }'],
  animations: [ fade ]
})
export class ContactFormComponent implements OnInit {

  pathEmployers = false;
  contact = new Contact();
  // isLoading = false;

  hasServerError: boolean;
  // filteredUsers: Contact[] =[];
  // usersForm :FormGroup;
  entities = [];
  navigate: any;
  employers = [];
  location: string;
  entityTypes = Object.keys(EntityTypes).map(function(e) {
    return { id: e, name: EntityTypes[e] };
  });
  e_types = Type;
  types = Object.keys(Type).map(function(e) {
    return { id: e, name: Type[e] };
  });
  employerId =0;
  organizations = [];

  constructor( private route: ActivatedRoute,
               private selectUnit: SelectUnitService,
               private router: Router,
               private productService: ProductService,
               private contactService: ContactService,
               protected notificationService: NotificationService,
               private helpers: HelpersService) {}

  ngOnInit() {
    this.organizations = this.helpers.organizations;
    if (this.router.url.includes( 'employers')) {
      this.pathEmployers = true;
      this.navigate = ['platform', 'employers',
        'form', this.selectUnit.currentEmployerID, 'contacts'];
      this.location = 'employers'
    }
    else if (this.router.url.includes( 'operator')) {
      this.location = 'operator';
      this.navigate =['platform', 'operator', 'contacts'];
    } else {
      this.navigate = ['platform', 'contacts'];
      this.location = 'settings'
    }


    if (this.route.snapshot.data.contact) {
      this.contact = this.route.snapshot.data.contact;
      this.employerId =  this.contact.employer_id;
    }

    if (this.contact.id) {
      this.loadEntities( this.contact.entity_type);
    }

    // this.usersForm = this.fb.group({
    //   userInput: null
    // });
    //
    // this.usersForm
    //   .get('userInput')
    //   .valueChanges
    //   .pipe(
    //     debounceTime(300),
    //     tap(() => this.isLoading = true),
    //     switchMap(value => this.contactService.search({name: value}, 1)
    //       .pipe(
    //         finalize(() => this.isLoading = false),
    //       )
    //     )
    //   )
    //   .subscribe(cons =>  this.filteredUsers = cons.results);
  }

  // displayFn(constant: Contact) {
  //   if (constant) { return constant.email; }
  // }

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

  loadEmployers(organizationID: number): void {
    this.employers = this.helpers.organizations.find(o => o.id === organizationID).employer
    this.employers.sort((a, b) => a.id - b.id);
  }


  submit(form: NgForm): void {
    this.hasServerError = false;
    if ( this.location !== 'operator'){
      this.employerId = this.selectUnit.currentEmployerID;
    }

    if(this.contact.id) {
      this.employerId = this.contact.employer_id;
    }

    if (this.employerId !== 0) {
      if (form.valid) {
        if (this.contact.id) {
          this.contactService.updateContact(this.contact, this.contact.id)
            .then(response => this.handleResponse(response));
        } else {
          this.contactService.newContact(this.contact, this.employerId)
            .then(response => this.handleResponse(response));
        }
      }
    }else {
      this.notificationService.error( 'יש לבחור מעסיק');
    }
  }

  private handleResponse(response: boolean): void {
    if (response) {
        this.router.navigate(this.navigate);
    } else {
      this.hasServerError = true;
    }
  }
}
