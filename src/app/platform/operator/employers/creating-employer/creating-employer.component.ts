import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';


import { OrganizationService } from 'app/shared/_services/http/organization.service';
import { GeneralHttpService } from 'app/shared/_services/http/general-http.service';
import { EmployerStatus, IdentifierTypes } from 'app/shared/_models/employer.model';
import { EmployerService } from 'app/shared/_services/http/employer.service';
import { ContactService } from 'app/shared/_services/http/contact.service';
import { HelpersService } from 'app/shared/_services/helpers.service';
import { PaymentType } from 'app/shared/_models/process.model';
import { Contact} from 'app/shared/_models/contact.model';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-creating-employer',
  templateUrl: './creating-employer.component.html',
  styleUrls: ['./creating-employer.component.css'],
  providers: [ContactService],
  animations: [ fade]
})
export class CreatingEmployerComponent implements OnInit {
  contact = new Contact();
  arrayContact: Contact[] = [];
  projects = [];
  banks = [];
  branchesD;
  branchesW;
  operators;
  classProcess;
  pageNumber = 1;
  selectedBankD: number; // bank number
  selectedBankW: number; //
  selectedBranchD; //
  selectedBranchW;
  organizations = [];
  uploadedFileXml: File;
  uploadedFilePoa: File;
  uploadedFileContract: File;
  uploadedFileProtocol: File;
  uploadedFileCustomer: File;
  widthProcess = 0;
  hasServerError = false;
  creatingEmployerForm: FormGroup;
  stringTitle: string;
  detailsBank: FormGroup;
  clickedCoun = false;
  organizationId: number;
  employerId;
  identifierTypes = Object.keys(IdentifierTypes).map(function(e) {
    return { id: e, name: IdentifierTypes[e] };
  });
  statuses = Object.keys(EmployerStatus).map(function(e) {
    return { id: e, name: EmployerStatus[e] };
  });
  paymentType = Object.keys(PaymentType).map(function(e) {
    return { id: e, name: PaymentType[e] };
  });
  constructor(
    private fb: FormBuilder,
    private  orgService: OrganizationService,
    private  contactService: ContactService,
    private  generalHttpService: GeneralHttpService,
    private  organizationService: OrganizationService,
    private  employerService: EmployerService,
    private  helpers: HelpersService,
    private _location: Location) {
    this.organizationId = 0;
  }

  ngOnInit() {
    this.generalHttpService.getBanks(true).then(banks => {
      this.banks = banks;
      this.organizationService.getOrganizationsNameAndId().then(response => {
        this.organizations = response;
      });
    });
    this.pageNumber = 1;
    this.employerService.getProjects().then(response => this.projects = response);
    this.updateData();
    this.getOperator();
    this.initForm();
  }
  initForm(): void {
    this.creatingEmployerForm = this.fb.group(
      {
        'employerDetails': this.fb.group({
          'newOrganization': [null, Validators.required],
          'name': [null, Validators.required],
          'identifier': [null, Validators.required],
          'receivedIdentifier': [null, [Validators.pattern('^[0-9]*$'), Validators.required]],
          'deductionNumber': [],
          'email': [null,  Validators.required],
          'phone': [null],
          'address': [null],
          'project': [null, Validators.required],
          'operator': [null, Validators.required],
          'status': [null, Validators.required],
          'paymentType': [null, Validators.required],
          'identifierType': [null, Validators.required],
          'senderIdentifier': [null, [Validators.pattern('^[0-9]*$'), Validators.required]],
          'institutionCode5': [null],
          'institutionCode8': [null]
          // 'email': [null, [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'), Validators.required]],
        }),
        'department': this.fb.group({
          'name': ['כללי', Validators.required]
        }),
        'contact': this.fb.array([
          this.fb.group({
          'firstName': [null , Validators.required],
          'lastName': [null , Validators.required],
          'addressContact': [null],
          'phoneContact': [null],
          'phoneContactMobile': [null , Validators.required],
          'emailContact': [null , Validators.required]
        })]),
        'comments':  ['']
      });

    this.detailsBank = this.fb.group({
      'payingBank': this.fb.group({
      'name': [null, Validators.required],
      'branchId': [null, Validators.required],
      'accountNumber': [null, [Validators.pattern('^\\d{5,9}$'), Validators.required]],
      'ownerId': [null],
      'ownerType': ['department'],
      'type': ['deposit'],
      'isPrimary': [true]
    }),
      'receivingBank': this.fb.group({
      'name': [null, Validators.required],
      'branchId': [null, Validators.required],
      'accountNumber': [null, [Validators.pattern('^\\d{5,9}$'), Validators.required]],
      'ownerId': [null],
      'ownerType': ['department'],
      'type': ['withdrawal'],
      'isPrimary': [true],
    })
    });
  }
  copyBankRow(): void {
    this.selectedBankW = this.selectedBankD;
    this.selectedBranchW = this.selectedBranchD;
    this.getBranches(2);
    const bankGroup = (<FormGroup>this.detailsBank.get('payingBank').value);
    this.detailsBank.controls['receivingBank'].patchValue({'accountNumber': bankGroup['accountNumber']});
  }
  getBranches(bank) {
    if (bank === 1) {
      this.branchesD = this.banks.find( b => b.id === this.selectedBankD).bank_branches;
    } else {
      this.branchesW = this.banks.find( b => b.id === this.selectedBankW).bank_branches;
    }
  }
  validCopy() {
    const bankGroup = (<FormGroup>this.detailsBank.get('payingBank').value);
    return this.selectedBankD > 0 && this.selectedBranchD > 0 && bankGroup['accountNumber'] > 0;
  }

  removeControl(index: number): void {
      const contactsGroup = (<FormArray>this.creatingEmployerForm.get('contact'));
      contactsGroup.removeAt(index);
  }
  getContactsArrControls(): any[] {
    return (<FormArray>this.creatingEmployerForm.get('contact')).controls;
  }
  getOperator(): void {
    this.employerService.getOperator().then(response => {
      this.operators = response;
    });
  }
  addContact(contact) {
    const contactControl = {
      // 'id': [contact  ? +contact['id'] : null],
      'first_name': [contact  ? +contact['firsName'] : null,  Validators.required],
      'last_name': [contact  ? +contact['lastName'] : null,  Validators.required],
      'role': [contact  ? +contact['role'] : null ],
      'phone': [contact  ? +contact['phoneContact'] : null ],
      'mobile': [contact  ? +contact['phoneContactMobile'] : null,  Validators.required],
      'email': [contact  ? +contact['emailContact'] : null,  Validators.required]
    };
    const contactGroup = (<FormArray>this.creatingEmployerForm.get('contact'));
    contactGroup.push(this.fb.group(contactControl));
  }
  backAndCancel() {
    if (this.pageNumber !== 1) {
      this.pageNumber -= 1;
      this.updateData();
    } else {
     // cancel
    }
  }

  saveContact(): void {
   const  contactSingle = this.creatingEmployerForm.get('contact').value;
   contactSingle.forEach( c => {
     this.contactService.newContact(c, this.employerId).then(
       response => this.handleResponse(response));
     });
  }

  private handleResponse(response: any): void {
    if (response.ok) {
      this._location.back();
    } else {
      this.hasServerError = true;
    }
  }

  updateData() {
    switch (this.pageNumber) {
      case 1: {
        this.classProcess = 'progress-bar process1 ';
        this.stringTitle = 'הקמת פרטי ארגון - שלב 1';
      } break;
      case 2: {
        this.classProcess = 'progress-bar process2';
        this.stringTitle = 'העלת חוזה - שלב 2';
      } break;
      case 3: {
        this.classProcess = 'progress-bar process3';
        this.stringTitle = ' העלת קבצי הארגון- שלב 3';
      } break;
      case 4: {
        this.classProcess = 'progress-bar process4';
        this.stringTitle = 'פרטי בנק של הארגון - שלב 4';
      } break;
      case 5: {this.classProcess = 'progress-bar process5';
        this.stringTitle = 'קליטת עובדים - שלב 5';
        this.widthProcess = 0;
      } break;
    }
  }
  continueProcess() {
    switch (this.pageNumber) {
      case 1: {
        if (this.creatingEmployerForm.valid) {
          this.pageNumber += 1;
          this.updateData();
        }
      }
        break;
      case 2: {
        this.clickedCoun = true;
        if (this.uploadedFileContract) {
          this.pageNumber += 1;
          this.clickedCoun = false;
          this.updateData();
        }
      }
        break;
      case 3: {
        this.clickedCoun = true;
        if (this.uploadedFilePoa && this.uploadedFileProtocol && this.uploadedFileCustomer) {
          this.pageNumber += 1;
          this.clickedCoun = false;
          this.updateData();
        }
      }
        break;
      case 4: {
        if (this.detailsBank.valid) {
          this.pageNumber += 1;
          this.updateData();
        }
      }
        break;
      case 5: {
        this.clickedCoun = true;
        if (this.uploadedFileXml) {
          this.updateData();
        }
      }
        break;
    }
  }
  submit(form: NgForm): void {
    if (this.uploadedFileXml) {
      this.updateData();
      this.helpers.setPageSpinner(true);
      this.employerService.newEmployer(
        this.creatingEmployerForm.controls['employerDetails'].value,
        this.creatingEmployerForm.controls['department'].value).then(response => {
          if (response) {
            this.employerId = response['employer_id'];
            const departmentId = response['department_id'];
            if (this.employerId === 0) {
              this.helpers.setPageSpinner(false);
              this.hasServerError = true;
            } else {
              this.saveContact();
              this.detailsBank.controls['payingBank'].value['ownerId'] = departmentId;
              this.generalHttpService.addNewBankAccount(this.detailsBank.controls['payingBank'].value)
                .then(responseB => {
                    if (responseB) {
                      this.detailsBank.controls['receivingBank'].value['ownerId'] = departmentId;
                      this.generalHttpService.addNewBankAccount(this.detailsBank.controls['receivingBank'].value)
                        .then(responseR => {
                          if (responseR) {
                            const comments = this.creatingEmployerForm.controls['comments'].value;
                            if (comments !== '') {
                              this.generalHttpService.newComment(this.employerId,
                                this.creatingEmployerForm.controls['comments'].value, 'employer');
                            }
                          }
                        });
                    }
                });
            }
          }
        });
      }
  }
}
