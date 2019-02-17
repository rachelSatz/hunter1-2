import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as FileSaver from 'file-saver';
import { MatDialog } from '@angular/material';

import { AddDocumentComponent } from './add-document/add-document.component';
import { DataTableComponent } from 'app/shared/data-table/data-table.component';
import { DataTableHeader } from 'app/shared/data-table/classes/data-table-header';

import { SelectUnitService } from 'app/shared/_services/select-unit.service';
import { DocumentService } from 'app/shared/_services/http/document.service';
import { NotificationService } from 'app/shared/_services/notification.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styles: ['.row-image { width: 30px; height: auto; }' ]
})
export class DocumentsComponent extends DataTableComponent implements OnInit , OnDestroy {


  constructor(route: ActivatedRoute, private documentService: DocumentService, private selectUnit: SelectUnitService,
    protected notificationService: NotificationService, private dialog: MatDialog) {
    super(route, notificationService);
    this.paginationData.limit = 5;
  }



readonly headers: DataTableHeader[] =  [
    { column: 'filename',     label: 'שם הקובץ' },
    { column: 'date',         label: 'תאריך העלאה' },
    { column: 'description',  label: 'סוג' },
  ];

  ngOnInit() {
    if (this.documentService.file) {
      this.paginatedItems[this.paginatedItems.length + 2] = this.documentService.file;
    }
    this.fetchItems();
    super.ngOnInit();
  }

  fetchItems() {
    this.documentService.getDocuments(this.selectUnit.currentEmployerID)
      .then(response => this.setItems(response));
  }


  ngOnDestroy() {
    super.ngOnDestroy();
  }

  file(item: any, type: string): any {
    this.documentService.downloadFile(item.id, this.selectUnit.currentEmployerID).then(response => {
      if (response) {
        const byteCharacters = atob(response['data']);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray],
          {type: 'application/' + item.ext.replace('.', '')});
        const fileURL = URL.createObjectURL(blob);
        if (type === 'show') {
          window.open(fileURL);
        } else {
          FileSaver.saveAs(blob, response['filename']);
        }
      }else {
        type =  type === 'show' ?  'להציג' : 'להוריד';
        this.notificationService.error('', ' אין אפשרות ' + type +  ' קובץ ');
      }
    });
  }

  deleteFile(id: number) {
    this.notificationService.warning('האם ברצונך למחוק את הקובץ?')
      .then(confirmation => {
      if (confirmation.value) {
        this.documentService.deleteFile(id, this.selectUnit.currentEmployerID).then(response => {
          if (response) {
            this.fetchItems();
          }
        });
      }
    });
  }

  addDocument() {
    this.dialog.open(AddDocumentComponent, {
      width: '400px',
      height: '500px'
    });
  }
}
