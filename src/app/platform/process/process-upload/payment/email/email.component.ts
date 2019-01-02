import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html'
})
export class EmailComponent implements OnInit {

  email = 'e@gmail.co.il';

  constructor( private router: Router, private dialogRef: MatDialogRef<EmailComponent>) { }

  ngOnInit() {
    setTimeout(() => {
      this.dialogRef.close();
      this.router.navigate(['platform', 'dashboard']);
    }, 2000);
  }

}
