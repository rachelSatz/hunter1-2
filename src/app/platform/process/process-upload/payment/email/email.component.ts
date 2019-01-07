import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html'
})
export class EmailComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
              private router: Router,
              private dialogRef: MatDialogRef<EmailComponent>) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.dialogRef.close();
      this.router.navigate(['platform', 'dashboard']);
    }, 2000);
  }

}
