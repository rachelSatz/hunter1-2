import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { fade } from 'app/shared/_animations/animation';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  styles: ['#styleFormat { height: 200px; padding-top: 20px }'],
  animations: [ fade ]

})
export class UserFormComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private route: ActivatedRoute,
              private router: Router,
              private dialogRef: MatDialogRef<UserFormComponent>) { }

  ngOnInit() {
  }

}
