import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { UserSessionService } from './shared/_services/user-session.service';
import { HelpersService } from './shared/_services/helpers.service';
import { FormsModule } from '@angular/forms';
import { SendFileEmailComponent } from 'app/shared/_dialogs/send-file-email/send-file-email.component';
import { MatChipsModule, MatFormFieldModule, MatIconModule } from '@angular/material';
import { ContactService } from 'app/shared/_services/http/contact.service';

const routes = [
  { path: '' , loadChildren: 'app/public/public.module#PublicModule' },
  { path: 'platform', loadChildren: 'app/platform/platform.module#PlatformModule' },
  { path: 'employer', loadChildren: 'app/employer/employer.module#EmployerModule' },
  { path: 'records', loadChildren: 'app/shared/shared/detailed-records/detailed-records.module#DetailedRecordsModule' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [AppComponent, SendFileEmailComponent],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule
  ],
  providers: [UserSessionService, HelpersService, ContactService],
  bootstrap: [AppComponent],
  entryComponents: [SendFileEmailComponent]
})
export class AppModule {}
