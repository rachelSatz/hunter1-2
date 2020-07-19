import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SelectItem} from '../../../../shared/_generic/select-item';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DepartmentFormComponent} from '../../../operator/employers/employer-form/departments/department-form/department-form.component';
import {NotificationService} from '../../../../shared/_services/notification.service';
import {HelpersService} from '../../../../shared/_services/helpers.service';
import {GroupService} from '../../../../shared/_services/http/group.service';
import {DataTableCriteria} from '../../../../shared/data-table/classes/data-table-criteria';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-add-to-group-dialog',
  templateUrl: './add-to-group-dialog.component.html',
  styleUrls: ['./add-to-group-dialog.component.css']
})
export class AddToGroupDialogComponent implements OnInit {
  groupName: string;
  hasFileTypeError = false;
  hasUploadError = false;
  error = false;
  create = false;
  add = false;
  file: File;
  isSubmitting = false;
  isEdit: boolean;
  groupForm: FormGroup;
  results: string;
  groups: SelectItem[];
  hasFileNoUpload = false;
  name: string;

  criteria: DataTableCriteria;
  constructor(public dialogRef: MatDialogRef<DepartmentFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private notificationService: NotificationService,
              private helpers: HelpersService,
              private fb: FormBuilder,
              private groupService: GroupService) { }

  ngOnInit() {
    if (this.data.mode === 'create') {
      this.create = true;
    } else {
      this.add = true;
    }
    this.initForm();
    this.groupName	= this.data.groupName;
    this.isEdit 	= !!this.data.groupId;
    this.criteria 	= this.data.dataTableCriteria;
  }

  initForm(): void {
    this.groupForm = this.fb.group({
      'groupId': 		[this.data.groupId],
      'groupName':  [null]
    });
  }

  uploadFile(file: File): void {
    const ext = file.name.substr(file.name.indexOf('.') + 1);
    if (['xls', 'xlsx', 'csv'].indexOf(ext) === -1) {
      this.hasFileTypeError = true;
      return;
    }
    this.hasFileTypeError = false;
    this.file = file;
  }

  handleResults(response: any): void {
    const message = this.create ? 'הקבוצה נוצרה בהצלחה והמעסיקים נקלטו' : 'המעסיקים נוספו לקבוצה בהצלחה.';
    this.isSubmitting = false;
    this.helpers.setPageSpinner(false);
    if (response['success']) {
      this.closeDialog();
      this.notificationService.success(message);
    } else {
      this.notificationService.error( response['message'], 'שגיאה כללית.');
      this.hasUploadError = true;
    }
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }

  downloadExample(): void {
    this.helpers.setPageSpinner(true);
    this.groupService.downloadExcelExample().then(response => {
      this.helpers.setPageSpinner(false);
      if (response['message'] === 'success') {
        const fileName = 'אקסל מעסיקים דוגמא';
        const blob_res = response['blob'];
        const byteCharacters = atob(blob_res['data']);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: 'application/' + 'xlsx'});
        FileSaver.saveAs(blob, fileName + '' + '.xlsx');
      }
      });
  }

  submit() {
    this.hasFileNoUpload = true;
    if (this.groupForm.valid && this.file !== undefined) {
      if (!this.isSubmitting) {
        this.isSubmitting = true;
        this.helpers.setPageSpinner(true);
        if (this.file) {
           if (this.create) {
             this.hasUploadError = false;
             this.groupService.createGroupByExcel(this.groupForm.get('groupName').value, this.file).then(
               response => this.handleResults(response)
             );
           } else {
             this.hasUploadError = false;
             this.groupService.updateByExcel(this.data.groupId, this.file).then(
               response => this.handleResults(response)
             );
           }
        } else {
          this.hasUploadError = true;
        }
      }
    }
  }

}
