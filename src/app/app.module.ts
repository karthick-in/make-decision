import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AuthGuard } from './auth.guard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ApiService } from './api.service';
import { Util } from './util';
import { HomeComponent } from './home/home.component';
import { TokeninterceptorService } from './tokeninterceptor.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { NewquestionComponent } from './newquestion/newquestion.component';
import { QuestionviewComponent } from './questionview/questionview.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    PageNotFoundComponent,
    AdminpanelComponent,
    NewquestionComponent,
    QuestionviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [ApiService,Util,AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokeninterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
