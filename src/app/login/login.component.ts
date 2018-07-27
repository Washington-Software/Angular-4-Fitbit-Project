import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public apiToken: string;
  public userID: string;
  public scope: string[];
  private tokenIsSet: boolean = false;
  private expiresIn: number;

  title = 'Sleep Grapher';
  private appKey: String = '22CXTV';
  private extractTokenRegex = /#access_token=(.*?)&/g;
  private extractIDRegex = /user_id=(.*?)&/g;
  private extractScopeRegex = /scope=(.*?)&/g

  constructor(@Inject(DOCUMENT) private document: any) {
  }

  ngOnInit(): void {
    let tempCheck = this.document.location.href;
    if (tempCheck.length > 30 && !this.tokenIsSet) {
      let temp = this.document.location.href;
      this.apiToken = this.extractTokenRegex.exec(temp)[1];
      this.userID = this.extractIDRegex.exec(temp)[1];
      this.scope = this.extractScopeRegex.exec(temp)[1].split("%20");
      this.tokenIsSet=true;
    }
  }

  public logout(): void {
    this.apiToken = null;
    this.expiresIn = null;
    this.tokenIsSet = false;
  }

  private authoriseWithFitbit(): void {
    this.document.location.href = 'https://www.fitbit.com/oauth2/authorize?response_type=token&client_id='+this.appKey +
      '&redirect_uri=http%3A%2F%2Flocalhost:4200%2Flogin&scope=heartrate%20profile%20sleep&expires_in=600';
  }
}
