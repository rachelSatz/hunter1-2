import { NgModule} from '@angular/core';
import { FormsModule  } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


const routes: Routes = [
  { path: '' , loadChildren: './start/start.module#StartModule' },
  ];


@NgModule({
  declarations: [
    AppComponent,


  ],
  imports: [
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
