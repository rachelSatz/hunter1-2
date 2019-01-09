import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-attach-reference',
  templateUrl: './attach-reference.component.html'
})
export class AttachReferenceComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: object) { }
  uploadedFile: File;
  typeDoc: string;
  ngOnInit() {
  }

}
