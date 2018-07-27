import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {IPersistenceContainer, PersistenceService, StorageType} from "angular-persistence";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public container: IPersistenceContainer;
  title = 'Sleep Grapher';
  private appKey: String = '22CXTV';
  private extractTokenRegex = /#access_token=(.*?)&/g;
  private extractIDRegex = /user_id=(.*?)&/g;
  private extractScopeRegex = /scope=(.*?)&/g;

  constructor(@Inject(DOCUMENT) private document: any, private persistenceService: PersistenceService) {
    this.container = persistenceService.createContainer('com.wasoftware.fitbit', {type: StorageType.SESSION});
  }

  ngOnInit(): void {
    let temp = this.document.location.href;
    if (!this.isLoggedIn() && this.extractTokenRegex.exec(temp) != null) {
      this.extractTokenRegex.lastIndex=0; //Reset internal pointer of regex
      this.container.set("apiToken", this.extractTokenRegex.exec(temp)[1]);
      this.container.set("userID", this.extractIDRegex.exec(temp)[1]);
      this.container.set("scope", this.extractScopeRegex.exec(temp)[1].split("%20"));
    }
  }

  public logout(): void {
    this.container.removeAll();
  }

  private authoriseWithFitbit(): void {
    this.document.location.href = 'https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=' + this.appKey +
      '&redirect_uri=http%3A%2F%2Flocalhost:4200%2Flogin&scope=heartrate%20profile%20sleep&expires_in=600';
  }

  private isLoggedIn(): boolean {
    return this.container.get("apiToken") != null;
  }
}
