import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from "./login/login.component";
import {HttpClientModule} from "@angular/common/http";
import {HomeComponent} from "./home/home.component";
import {FormsModule} from "@angular/forms";
import {AppRoutingModule} from './app-routing.module';
import {PersistenceModule} from "angular-persistence";
import {DataService} from "./data.service";
import {DatePipe} from "@angular/common";
import {GraphComponent} from "./graph/graph.component";
import {HttpModule} from '@angular/http';
import {DeviceDetectorModule} from 'ngx-device-detector'


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    PersistenceModule,
    HttpModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [DataService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
