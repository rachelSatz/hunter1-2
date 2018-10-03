import { NgModule  } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { UserSessionService } from './shared/_services/user-session.service';

const routes = [
  { path: '', loadChildren: 'app/public/public.module#PublicModule' },
  { path: 'platform', loadChildren: 'app/platform/platform.module#PlatformModule' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [UserSessionService],
  bootstrap: [AppComponent]
})
export class AppModule {}
