import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { UserSessionService } from './shared/_services/user-session.service';
import { HelpersService } from './shared/_services/helpers.service';
import { FormsModule } from '@angular/forms';
import { IsAuthenticatedGuard } from 'app/shared/_guards/is-authenticated.guard';

const routes = [
  { path: '' , loadChildren: 'app/public/public.module#PublicModule' },
  { path: 'platform', loadChildren: 'app/platform/platform.module#PlatformModule' },
  { path: 'records', loadChildren: 'app/shared/shared/detailed-records/detailed-records.module#DetailedRecordsModule' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [UserSessionService, HelpersService, IsAuthenticatedGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
