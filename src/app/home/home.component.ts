import {Component, OnInit} from '@angular/core';
import {PersistenceService, StorageType} from "angular-persistence";
import {DataService, Sleep, UserSummary, HeartData} from "../data.service";


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public container;
  public userSummary: UserSummary;
  public sleepSummary;
  public heart;
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
      this.dataService.getSleep(this.container.get("userID"), this.container.get("apiToken"), new Date("2018-08-01")).subscribe(
        (response: Sleep) => {
          console.log(DataService.getSleepStartAndEnd(response));
          let tempArray = DataService.getSleepStartAndEnd(response); // This is the line you missed
          this.dataService.getHeart(this.container.get("userID"), this.container.get("apiToken"), tempArray[0], tempArray[1], "1min").subscribe(
            (response: HeartData) => {
              console.log(response);
              console.log(DataService.getHeartrateIntraday(response));
            });
        });
    }
  }
}
