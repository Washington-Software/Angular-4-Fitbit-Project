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
  private appKey: String = '22D2L9';
  private extractTokenRegex = /#access_token=(.*?)&/g;
  private extractIDRegex = /user_id=(.*?)&/g;
  private extractScopeRegex = /scope=(.*?)&/g;

  /**
   * Inject dependencies and create the persistence container.
   * @param {any} document A reference to the DOM object. Used to get the current URL and any callbacks.
   * @param {PersistenceService} persistenceService A persistence service used to create a Persistence Container.
   */
  constructor(@Inject(DOCUMENT) private document: any, private persistenceService: PersistenceService) {
    this.container = persistenceService.createContainer('com.wasoftware.fitbit', {type: StorageType.SESSION});
  }

  /**
   * Run every time the page is displayed. Checks if the user is logged in, and if there's a callback to be processed.
   * If the user is not logged in and a callback is to be processed, then the method parses the callback and places the
   * relevant information into the relevant keys in the container.
   */
  ngOnInit(): void {
    let temp = this.document.location.href;
    if (!this.isLoggedIn() && this.extractTokenRegex.exec(temp) != null) {
      this.extractTokenRegex.lastIndex = 0; //Reset internal pointer of regex
      this.container.set("apiToken", this.extractTokenRegex.exec(temp)[1]);
      this.container.set("userID", this.extractIDRegex.exec(temp)[1]);
      this.container.set("scope", this.extractScopeRegex.exec(temp)[1].split("%20"));
    }
  }

  /**
   * Logs the user out by clearing all stored information from the persistence container.
   */
  public logout(): void {
    this.container.removeAll();
  }

  /**
   * Redirects the user to the Fitbit authorisation page, authenticating with the provided app key.
   */
  private authoriseWithFitbit(): void {
    this.document.location.href = 'https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=' + this.appKey +
      '&scope=heartrate%20profile%20sleep&expires_in=600';
  }
  //&redirect_uri=sleepgrapher%3A%2F%2F#%2Flogin

  /**
   * Checks whether the user is logged in by verifying if the token exists.
   *
   * @return {boolean} The login state
   */
  private isLoggedIn(): boolean {
    return this.container.get("apiToken") != null;
  }
}
