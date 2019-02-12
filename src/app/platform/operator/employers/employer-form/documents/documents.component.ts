import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {


  readonly headers = ['שם קובץ', 'תאריך העלאה', 'אפשרויות', 'סוג'];

  constructor() { }

  ngOnInit() {
  }

}
