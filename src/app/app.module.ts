import { NgModule} from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserSessionService } from './shared/_services/http/user-session.service';
import { DatePipe } from '@angular/common';
import {HelpersService} from './shared/_services/helpers.service';

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
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [ HelpersService, UserSessionService, DatePipe ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
