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
  chosen: string;
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
      if (this.chosen != null) {
        this.dataService.getSleep(this.container.get("userID"), this.container.get("apiToken"), new Date(this.chosen)).subscribe(
          (response: Sleep) => {
            console.log(DataService.getSleepStartAndEnd(response));
            let tempArray = DataService.getSleepStartAndEnd(response); // This is the line you missed
            this.dataService.getHeart(this.container.get("userID"), this.container.get("apiToken"), tempArray[0], tempArray[1], "1min").subscribe(
              (response: HeartData) => {
                console.log(response);
                //console.log(DataService.getHeartrateIntraday(response));
              });

          });
      }
    }
  }
  something() {
    this.chosen = document.forms[0].date.value;
    console.log(this.chosen);
    this.ngOnInit();
    const tday = new Date();
    const d = tday.getDate();
    const m = tday.getMonth() + 1; // January is 0!
    const y = tday.getFullYear();
    let dd;
    let mm;
    if (d < 10) {
      dd = '0' + d.toString();
    } else {
      dd = d.toString();
    }
    if (m < 10) {
      mm = '0' + m.toString();
    } else {
      mm = m.toString();
    }
    const today = y.toString() + '-' + mm + '-' + dd;
    console.log(today);

  }
}
