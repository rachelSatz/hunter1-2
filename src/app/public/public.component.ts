import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { LoginComponent } from './login/login.component';
import {AppHttpService} from '../shared/_services/http/app-http.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css']
})
export class PublicComponent {

  file: Blob;

  constructor(private dialog: MatDialog, private appHttp: AppHttpService) {}

  openLogin(): void {
    this.dialog.open(LoginComponent, {
      width: '400px'
    });
  }

  submit(): void {
    this.appHttp.upload(this.file)
  }
}
