import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { PlatformComponent } from 'app/platform/platform.component';

import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { DocumentService } from 'app/shared/_services/http/document.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { NotificationService } from 'app/shared/_services/notification.service';
import { ProcessService } from 'app/shared/_services/http/process.service';
import { ProcessDataService } from 'app/shared/_services/process-data-service';
import { SelectUnitService } from 'app/shared/_services/select-unit.service';

import { Employer, EmployerStatus, IdentifierTypes } from 'app/shared/_models/employer.model';
import { PaymentType } from 'app/shared/_models/process.model';
import { Contact} from 'app/shared/_models/contact.model';
import { fade } from 'app/shared/_animations/animation';
import { ActivatedRoute, Router} from '@angular/router';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {Month} from '../../../../shared/_const/month-bd-select';


@Component({
  selector: 'app-creating-employer',
  templateUrl: './creating-employer.component.html',
  styleUrls: ['./creating-employer.component.css'],
  animations: [ fade]
})
export class CreatingEmployerComponent implements OnInit {
  employer = new Employer();
  contact = new Contact();
  projects = [];
  organizations = [];
  documentId: number;
  banks = [];
  branchesD;
  branchesW;
  operators = [];
  pageNumber = 1;
  maxPageNumber = 1;
  selectedBankD: number;
  selectedBankW: number;
  selectedBranchD;
  selectedBranchW;
  uploadedFileXml: File;
  uploadedFilePoa: File;
  uploadedFileContract: File;
  uploadedFileProtocol: File;
  uploadedFileCustomer: File;
  employeeFileName: string;
  hasServerError: boolean;
  creatingEmployerForm: FormGroup;
  clickedContinue: boolean;
  planId: number;
  isEdit = false;
  organizationId: number;
  departmentId;
  employerId;
  count = 1;
  cities = [];
  month: number;
  year: number;
  readonly months = Month;
  readonly years = [];
  fileTypeError;
  identifierTypes = Object.keys(IdentifierTypes).map(function(e) {
    return { id: e, name: IdentifierTypes[e] };
  });
  statuses = Object.keys(EmployerStatus).map(function(e) {
    return { id: e, name: EmployerStatus[e] };
  });
  paymentType = Object.keys(PaymentType).map(function(e) {
    return { id: e, name: PaymentType[e] };
  });

  detailsPage = [ {title : 'הקמת פרטי ארגון - שלב 1', progress : 'progress-bar process1'},
    {title : 'העלת חוזה - שלב 2' , progress : 'progress-bar process2'},
    {title : 'העלת קבצי הארגון- שלב 3', progress : 'progress-bar process3'},
    {title : 'פרטי בנק של הארגון - שלב 4', progress : 'progress-bar process4'},
    {title : 'קליטת עובדים - שלב 5', progress : 'progress-bar process5'},
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private selectUnit: SelectUnitService,
    private processService: ProcessService,
    private orgService: OrganizationService,
    private documentService: DocumentService,
    private contactService: ContactService,
    private generalHttpService: GeneralHttpService,
    private organizationService: OrganizationService,
    private employerService: EmployerService,
    public route: ActivatedRoute,
    private helpers: HelpersService,
    private  platformComponent: PlatformComponent,
    private notificationService: NotificationService,
    public processDataService: ProcessDataService,
    private _location: Location) {
    this.organizationId = 0;
  }

  ngOnInit() {
    if (this.route.snapshot.params.id) {
      this.helpers.setPageSpinner(true);
    }
    if (this.route.snapshot.queryParams) {
      this.pageNumber = this.route.snapshot.queryParams['pageNum'];
      this.planId = this.route.snapshot.queryParams['planId'];
    }
    this.initForm();
    this.employerService.getCity().then(response => {
      this.cities = response;
    });
    this.employerService.getProjects().then(response => this.projects = response);
    this.getOperator();
    this.generalHttpService.getBanks(true).then(banks => {
      this.banks = banks;
      this.organizationService.getOrganizationsNameAndId().then(response => {
        this.organizations = response;
        if (this.route.snapshot.params.id) {
          this.employerService.getEmployer(this.route.snapshot.params.id).then( responseEmployer => {
            if (responseEmployer) {
              this.employer = responseEmployer;
              this.uploadData(this.route.snapshot.data);
            }
          });
        } else {
          this.pageNumber = 1;
        }
      });
    });
  }

  initForm(): void {
    this.creatingEmployerForm = this.fb.group({
      'creatingEmployer': this.fb.group({
        'employerDetails': this.fb.group({
          'newOrganization': [null],
          'organization': [null],
          'name': [null, Validators.required],
          'identifier': [null, [Validators.pattern('^[0-9]*$'), Validators.required]],
          'receivedIdentifier': [null, [Validators.pattern('^[0-9]*$'), Validators.required]],
          'deductionNumber': [],
          'phone': [null, [Validators.pattern('[0-9]{0-10}')]],
          'address': [null],
          'city_id': [null],
          'project': [null, Validators.required],
          'operator': [null, Validators.required],
          'status': ['on_process'],
          'paymentType': [null, Validators.required],
          'identifierType': [null, Validators.required],
          'senderIdentifier': [null, [Validators.pattern('^[0-9]*$'), Validators.required]],
          'institutionCode5': [null],
          'institutionCode8': [null]
        }),
        'department': this.fb.group({
          'name': ['כללי', Validators.required]
        }),
        'contact': this.fb.array([
          this.fb.group({
            'first_name': [null , Validators.required],
            'last_name': [null , Validators.required],
            'entity_type': ['employer'],
            'role': [null],
            'phone': [null, Validators.pattern('^[0-9]*$')],
            'mobile': [null, Validators.pattern('^[0-9]*$')],
            'email': [null , [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'), Validators.required]],
            'comment':  ['']
          })]),
      }),
      'detailsBank': this.fb.group({
        'payingBank': this.fb.group({
          'bankId': [null, Validators.required],
          'branchId': [null, Validators.required],
          'accountNumber': [null, [Validators.pattern('^\\d{5,9}$'), Validators.required]],
          'ownerId': [null],
          'ownerType': ['department'],
          'type': ['deposit'],
          'isPrimary': [true]
        }),
        'receivingBank': this.fb.group({
          'bankId': [null, Validators.required],
          'branchId': [null, Validators.required],
          'accountNumber': [null, [Validators.pattern('^\\d{5,9}$'), Validators.required]],
          'ownerId': [null],
          'ownerType': ['department'],
          'type': ['withdrawal'],
          'isPrimary': [true],
        })
      }),
      'xmlFile': this.fb.group({
        'month': [null],
        'year': [null],
      })
    });
  }

  uploadData(data) {
    this.employerId = this.employer.id;
    this.creatingEmployerForm.get('creatingEmployer.employerDetails').patchValue({
      organization: this.employer.organization_id,
      name: this.employer.name,
      identifier: this.employer.identifier,
      receivedIdentifier: this.employer.received_identifier ? this.employer.received_identifier : null,
      phone: this.employer.phone,
      address: this.employer.address,
      city: this.employer.city_id,
      project: this.employer.project_id ? this.employer.project_id : null,
      paymentType: this.employer.payment_type ? this.employer.payment_type : null,
      operator: this.employer.operator ?  this.employer.operator.id : null,
      status: 'on_process',
      identifierType: this.employer.sender_identifier_type ? this.employer.sender_identifier_type : null,
      senderIdentifier: this.employer.sender_identifier ? this.employer.sender_identifier : null,
      institutionCode5: this.employer.institution_code_5 ? this.employer.institution_code_5 : null,
      institutionCode8: this.employer.institution_code_8 ? this.employer.institution_code_8 : null
    });
    if (data.items.contacts.length > 0) {
      data.items.contacts.forEach((contact, index) => {
        const contactControl = {
          'first_name': [contact ? contact.first_name : null, Validators.required],
          'last_name': [contact ? contact.last_name : null, Validators.required],
          'role': [contact ? contact.role : null],
          'entity_type': ['employer'],
          'phone': [contact ? contact.phone : null, Validators.pattern('^[0-9]*$')],
          'mobile': [contact ? contact.mobile : null, Validators.pattern('^[0-9]*$')],
          'email': [contact ? contact.email : null,
            [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'), Validators.required]],
          'comment':  contact.comment
        };
        const contactGroup = (<FormArray>this.creatingEmployerForm.get('creatingEmployer.contact'));
        if ( index === 0 ) {
          contactGroup.setControl(0, this.fb.group(contactControl));
        } else {
          contactGroup.push(this.fb.group(contactControl));
        }
      });
    }
    if (data.items.documents.length > 0) {
      data.items.documents.forEach( document => {
        switch (document.document_type) {
          case 'contract': this.uploadedFileContract = document; break;
          case 'employer_poa': this.uploadedFilePoa = document; break;
          case 'authorization_protocol': this.uploadedFileProtocol = document; break;
          case 'customer_details': this.uploadedFileCustomer = document; break;
        }
      });
    }
    if (data.items.employee_file) {
      this.employeeFileName = this.getNameFile(data.items.employee_file);
    }
    if (data.items.bank.length > 0 ) {
      this.selectedBankD = data.items.bank[0].bank_id.toString();
      this.branchesD = this.banks.find( b => b.id === this.selectedBankD).bank_branches;
      this.selectedBranchD = data.items.bank[0].branch_id;
      this.creatingEmployerForm.get('detailsBank.payingBank').patchValue({
        accountNumber: data.items.bank[0].number,
      });
      this.selectedBankW = data.items.bank[1].bank_id.toString();
      this.branchesW = this.banks.find( b => b.id === this.selectedBankW).bank_branches;
      this.selectedBranchW = data.items.bank[1].branch_id;
      this.creatingEmployerForm.get('detailsBank.receivingBank').patchValue({
        accountNumber: data.items.bank[1].number,
      });
    }
    this.helpers.setPageSpinner(false);
  }

  getNameFile(pathFile: string) {
     pathFile = pathFile.split('\\').join('/');
     let res = pathFile.split('/');
     res =  res[res.length - 1].split('.');
     return res[0];
  }

  enableOrganization(form: NgForm , isEdit: Boolean): void {
    this.isEdit = !isEdit;
    if (isEdit) {
      this.creatingEmployerForm.get('creatingEmployer.employerDetails').patchValue({'newOrganization': null});
    } else {
      this.creatingEmployerForm.get('creatingEmployer.employerDetails').patchValue({'organization': null});
      this.organizationId = 0;
    }
  }

  copyBankRow(): void {
    this.selectedBankW = this.selectedBankD;
    this.getBranches(2);
    this.selectedBranchW = this.selectedBranchD;
    const bankGroup = (<FormGroup>this.creatingEmployerForm.get('detailsBank.payingBank').value);
    this.creatingEmployerForm.get('detailsBank.receivingBank').patchValue({'accountNumber': bankGroup['accountNumber']});
  }

  getBranches(bank: number): void {
    if (bank === 1) {
      this.branchesD = this.banks.find( b => b.id === this.selectedBankD).bank_branches;
      if  (!this.branchesD.find( b => b.id === this.selectedBranchD.toString())) {
        this.selectedBranchD = 0;
      }
    } else {
      this.branchesW = this.banks.find( b => b.id === this.selectedBankW).bank_branches;
      if  (!this.branchesW.find( b => b.id === this.selectedBankW.toString())) {
        if (this.count !== 1) {
          this.selectedBranchW = 0;
        }
        this.count += 1;
      }
    }
  }

  validCopy(): boolean {
    const bankGroup = (<FormGroup>this.creatingEmployerForm.get('detailsBank.payingBank').value);
    return this.selectedBankD > 0 && this.selectedBranchD > 0 && bankGroup['accountNumber'] > 0;
  }

  removeControl(index: number): void {
      const contactsGroup = (<FormArray>this.creatingEmployerForm.get('creatingEmployer.contact'));
      contactsGroup.removeAt(index);
      if (this.route.snapshot) {
        this.deleteEmployerContact(5);
      }
  }

  deleteEmployerContact(id) {
    this.notificationService.warning('האם ברצונך למחוק את האיש קשר?')
      .then(confirmation => {
        if (confirmation.value) {
          this.contactService.deleteEmployerContact(id).then(response => response);
        }
      });
  }

  getContactsArrControls() {
     return (<FormArray>this.creatingEmployerForm.get('creatingEmployer.contact')).controls;
  }

  getOperator(): void {
    this.employerService.getOperator().then(response => {
      this.operators = response;
    });
  }

  addContact(): void {
    const  contactSingle = this.creatingEmployerForm.get('creatingEmployer.contact').value;
    let validContact = true;
    contactSingle.forEach( c => {
      const phone = c['mobile'] !== null ? c['mobile'] : c['phone'] !== null ? c['phone'] : null;
      if (c['first_name'] === null || c['last_name'] === null || phone === null  || c['email'] === null) {
         validContact = false;
      }
    });
    if (validContact) {
      const contactControl = {
        'first_name': [null,  Validators.required],
        'last_name': [ null,  Validators.required],
        'role': [ null ],
        'entity_type': ['employer'],
        'phone': [null , [Validators.pattern('^[0-9]*$')]],
        'mobile': [null,  [Validators.pattern('^[0-9]*$')]],
        'email': [null,
          [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'), Validators.required]],
        'comment':  ['']
      };
      const contactGroup = (<FormArray>this.creatingEmployerForm.get('creatingEmployer.contact'));
      contactGroup.push(this.fb.group(contactControl));
    }
  }

  backAndCancel(): void {
    if (this.pageNumber !== 1) {
      if (this.maxPageNumber < this.pageNumber) {
        this.maxPageNumber = this.pageNumber;
      }
      this.pageNumber -= 1;
    } else {
      this._location.back();
    }
  }

  saveContact(): void {
   const  contactSingle = this.creatingEmployerForm.get('creatingEmployer.contact').value;
   if (contactSingle.length > 0 ) {
     contactSingle.forEach( c => {
       if ( c['first_name'] || c['last_name'] || c['mobile'] || c['email']) {
         this.contactService.newContact(c, this.employerId).then(
           response => this.handleResponse(response));
       }
     });
   }
  }

  private handleResponse(response: any): void {
    if (response.ok) {
      this._location.back();
    } else {
      this.hasServerError = true;
    }
  }

  private checkValidFiles(): boolean {
      return (this.uploadedFilePoa && this.validationFile(this.uploadedFilePoa) ||
              this.uploadedFileCustomer && this.validationFile(this.uploadedFileCustomer) ||
              this.uploadedFileContract && this.validationFile(this.uploadedFileContract) ||
              this.uploadedFileProtocol && this.validationFile(this.uploadedFileProtocol));
  }

  private checkValidData(): boolean {
    const employer = this.creatingEmployerForm.get('creatingEmployer.employerDetails');
    return (employer.value['phone'] !== null && employer.get('phone').valid) || employer.value['phone'] === null;
  }

  continueProcess(): void {
    if (this.pageNumber === 1 && this.validation() && this.checkValidData()) {
        this.pageNumber += 1;
    } else if (this.pageNumber === 2 || this.pageNumber === 3) {
      if (this.checkValidFiles() || (!this.uploadedFilePoa && !this.uploadedFileCustomer && !this.uploadedFileContract &&
        !this.uploadedFileProtocol)) {
        this.pageNumber += 1;
      }
    } else if (this.pageNumber === 4 && ((this.isDetailsBank() && this.creatingEmployerForm.controls['detailsBank'].valid) ||
                !this.isDetailsBank())) {
      this.pageNumber += 1;
    }
  }

  updateData() {
    this.employerService.updateEmployer(this.creatingEmployerForm.get('creatingEmployer.employerDetails').value, this.employer.id)
      .then(response => {
        if (response) {
          this.platformComponent.getOrganizations(true, true);
          this.departmentId = response['department_id'];
          this.addContactsDocsBank();
        } else {
          this.helpers.setPageSpinner(false);
          this.hasServerError = true;
        }
      });
  }

  addContactsDocsBank() {
    this.saveContact();
    if (this.checkValidFiles()) {
      const files = [this.uploadedFileContract, this.uploadedFilePoa, this.uploadedFileProtocol, this.uploadedFileCustomer];
      this.documentService.uploadFiles(files, this.employerId).then(response =>  {
        if (response) {}});
    }
    if (this.creatingEmployerForm.get('detailsBank').valid) {
        this.addBankAccount();
    }
    if (this.uploadedFileXml && !this.fileTypeError) {
      this.sendFile();
    } else {
      this.routerViewEmployer();
    }
  }

  routerViewEmployer(): void {
    this.helpers.setPageSpinner(false);
    if (this.router.url.includes( 'operator')) {
      this.router.navigate(['/platform', 'operator' , 'employers']);
    } else {
      this.router.navigate(['/platform', 'employers']);
    }
  }

  addData() {
    this.employerService.newEmployer(
      this.creatingEmployerForm.get('creatingEmployer.employerDetails').value,
      this.creatingEmployerForm.get('creatingEmployer.department').value).then(response => {
      if (response) {
        this.platformComponent.getOrganizations(true, true);
        this.employerId = response['employer_id'];
        this.departmentId = response['department_id'];
        if (this.employerId === 0) {
          this.helpers.setPageSpinner(false);
          this.hasServerError = true;
          this.notificationService.error('המעסיק קיים במערכת');
        } else {
          this.addContactsDocsBank();
        }
      }
    });
  }

  insertData(): void {
    this.helpers.setPageSpinner(true);
    if (this.route.snapshot.params.id) {
      this.updateData();
    } else {
      this.addData();
    }
  }

  addBankAccount(): void {
    this.creatingEmployerForm.get('detailsBank.payingBank').value.ownerId = this.departmentId;
    if ( this.route.snapshot.params.id && this.route.snapshot.data.items.bank.length > 0) {
      this.generalHttpService.updateBank(this.creatingEmployerForm.get('detailsBank.payingBank').value ,
        this.route.snapshot.data.items.bank[0].id)
        .then(response => {
          if (response) {
            this.creatingEmployerForm.get('detailsBank.receivingBank').value['ownerId'] = this.departmentId;
            this.generalHttpService.updateBank(this.creatingEmployerForm.get('detailsBank.receivingBank').value,
              this.route.snapshot.data.items.bank[1].id)
              .then(responseAdd => responseAdd);
          }
        });
    } else {
      this.generalHttpService.addNewBankAccount(this.creatingEmployerForm.get('detailsBank.payingBank').value)
        .then(response => {
          if (response) {
            this.creatingEmployerForm.get('detailsBank.receivingBank').value['ownerId'] = this.departmentId;
            this.generalHttpService.addNewBankAccount(this.creatingEmployerForm.get('detailsBank.receivingBank').value)
              .then(responseAdd => responseAdd);
          }
        });
    }
  }

  isDetailsContact() {
    const contacts = this.creatingEmployerForm.get('creatingEmployer.contact').value;
    let isContact = false;
    contacts.forEach( contact => {
      if (contact['first_name'] || contact['last_name'] || contact['mobile'] || contact['email']) {
       isContact = true;
      }
    });
    return isContact;
  }

  isDetailsBank(): boolean {
    const payingBank = this.creatingEmployerForm.get('detailsBank.payingBank').value;
    const receivingBank = this.creatingEmployerForm.get('detailsBank.receivingBank').value;
    return payingBank.name || payingBank.branchId || payingBank.accountNumber || receivingBank.name ||
      receivingBank.branchId || receivingBank.accountNumber;
  }

  validationFile(file: File): boolean {
    return (['docx', 'doc',  'pdf'].includes(file.name.split('.').pop()));
  }

  setFile(file: File): void {
    const ext = file.name.substr(file.name.indexOf('.') + 1);
    if (['xml', 'dat', 'xlsx', 'xls'].indexOf(ext.toLowerCase()) === -1) {
      this.fileTypeError = true;
      return;
    }
    this.fileTypeError = false;
    const type = file.name.indexOf('NEG') === -1 ? 'positive' : 'negative';
    if (type !== 'positive') {
      this.notificationService.error('אינך יכול להעלות קובץ שלילי');
      this.uploadedFileXml = null;
    }
  }

  sendFile(): void {
    const month = this.creatingEmployerForm.get('xmlFile.month');
    const year = this.creatingEmployerForm.get('xmlFile.year');
    const data = {
      'month':  month ? month.toString() : new Date().getMonth().toString(),
      'year': year ? year.toString() : new Date().getFullYear().toString(),
      'processName': '',
      'departmentId': this.departmentId,
      'type': 'positive',
      'isDirect': false,
      'processId': '',
      'pageNumber': 1
    };

    this.processService.newProcess(data, this.uploadedFileXml, null, true).then(response => {
      if (response['processId']) {
        data.processId = response['processId'];
        data['file'] =  this.uploadedFileXml ;
        this.platformComponent.getOrganizations(true, true);
        this.processDataService.setProcess(data);
        this.routerViewEmployer();
      } else {
        this.notificationService.error('העלאת הקובץ נכשלה');
      }
    });
  }

  validation(): boolean {
    const employer = this.creatingEmployerForm.get('creatingEmployer.employerDetails');
    const contacts1 = (<FormArray>this.creatingEmployerForm.get('creatingEmployer.contact')).controls;
    contacts1.forEach(
       contact => {
        if (contact.get('mobile').value === null || contact.get('mobile').value === '') {
          contact.get('phone').setValidators(Validators.required);
          contact.get('mobile').clearValidators();
          contact.get('mobile').updateValueAndValidity();
        } else if (contact.get('phone').value === null || contact.get('phone').value === '' ) {
          contact.get('mobile').setValidators(Validators.required);
          contact.get('phone').clearValidators();
          contact.get('phone').updateValueAndValidity();
        }
      });
    const contacts = this.creatingEmployerForm.get('creatingEmployer.contact');
    return ((employer.value['newOrganization'] !== null || employer.value['organization'] !== null) &&
      employer.value['name'].value !== null && employer.value['identifier'] !== null)
      && (this.isDetailsContact() && contacts.valid || this.isDetailsContact() === false);
  }

  submit(): void {
    if (this.validation()) {
      if (this.creatingEmployerForm.get('creatingEmployer').valid && this.uploadedFileContract &&
        this.validationFile(this.uploadedFileContract) && this.uploadedFilePoa && this.uploadedFileProtocol &&
        this.uploadedFileCustomer && this.validationFile(this.uploadedFilePoa) && this.validationFile(this.uploadedFileProtocol) &&
        this.validationFile(this.uploadedFileCustomer) && this.creatingEmployerForm.get('detailsBank').valid &&
        (( this.uploadedFileXml && !this.fileTypeError) || this.employeeFileName)) {
        this.creatingEmployerForm.get('creatingEmployer.employerDetails').value['status'] = 'active';
      } else {
        this.creatingEmployerForm.get('creatingEmployer.employerDetails').value['status'] = 'on_process';
      }
      this.insertData();
    }
  }
}
