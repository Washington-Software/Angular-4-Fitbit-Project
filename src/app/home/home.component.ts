import {Component, OnInit} from '@angular/core';
import {PersistenceService, StorageType} from "angular-persistence";
import {DataService, Sleep, UserSummary} from "../data.service";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public container;
  public userSummary: UserSummary;
  public sleepSummary;
  title: string;

  constructor(private persistenceService: PersistenceService, private dataService: DataService) {
    this.container = persistenceService.createContainer('com.wasoftware.fitbit', {type: StorageType.SESSION});
  }

  ngOnInit(): void {
    if (this.container.get("apiToken") != null) {
      this.dataService.getProfile(this.container.get("userID"), this.container.get("apiToken")).subscribe((response: UserSummary) => {
        this.userSummary = response;
        this.title = this.userSummary.user.fullName;
      });
      this.dataService.getSleep(this.container.get("userID"), this.container.get("apiToken"), new Date("2018-07-25")).subscribe(
        (response: Sleep) => {
          console.log(DataService.getSleepStartAndEnd(response));
        });
    }
  }
}
