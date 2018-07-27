import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from "./login/login.component";
import {HttpClientModule} from "@angular/common/http";
import {HomeComponent} from "./home/home.component";
import {FormsModule} from "@angular/forms";
import {AppRoutingModule} from './app-routing.module';
import {PersistenceModule} from "angular-persistence";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    PersistenceModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
