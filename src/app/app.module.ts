import { NgModule} from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes} from '@angular/router';
import {
  MatFormFieldModule,
  MatChipsModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatDatepickerModule,
  MatCheckboxModule,
  MatDividerModule,
  MatDialogModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { HelpersService } from './shared/_services/helpers.service';
import {UserSessionService} from './shared/_services/http/user-session.service';
import {BdSelectModule} from '../assets/js/bd-select/bd-select.module';
import {DatePickerModule} from './shared/app-date-picker/app-date-picker.module';
import {DatePipe} from '@angular/common';

const routes: Routes = [
  { path: '' , loadChildren: './public/public.module#PublicModule' },
  { path: 'platform', loadChildren: './platform/platform.module#PlatformModule' },
  { path: '**', redirectTo: '' }
  ];


@NgModule({

  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    BdSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatDatepickerModule,
    DatePickerModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  // providers: [HttpClientModule,HelpersService,NotificationService,UserSessionService,AppHttpService,EmployerService],
  providers: [HelpersService,UserSessionService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
