import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-open-sent',
  templateUrl: './open-sent.component.html',
})
export class OpenSentComponent implements OnInit {

  comments= '';

  constructor(private dialogRef: MatDialogRef<OpenSentComponent>) { }

  ngOnInit() {
  }

  submit(form): void {
    if (form.valid) {
      this.dialogRef.close(this.comments);
    }
  }

}
