import {Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/map';
import {PersistenceService, StorageType} from "angular-persistence";
import {DataService, HeartData, Sleep, UserSummary} from "../data.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit {
  private static datePipe = new DatePipe("en-US");
  public container;
  public userSummary: UserSummary;
  chosen: string;
  title: string;

  constructor(private persistenceService: PersistenceService, private dataService: DataService) {
    this.container = persistenceService.createContainer('com.wasoftware.fitbit', {type: StorageType.SESSION});
  }

  public static analyse(heartData: [Date[], number[]], meansData: [Date[], number[]]): string {
    console.log("Date: " + GraphComponent.datePipe.transform(heartData[0][0], "yyyy-MM-dd"));
    console.log("first value: " + heartData[1][0]);
    console.log("middle value: " + heartData[1][Math.floor(heartData[2].length / 2)] + " at " + GraphComponent.datePipe.transform(heartData[0][Math.floor(heartData[2].length / 2)], "HH:mm"));
    console.log("last value: " + heartData[1][heartData[1].length - 1]);
    console.log("first movingMean: " + meansData[1][0]);
    console.log("middle movingMean: " + meansData[1][Math.floor(meansData[1].length / 2)]);
    console.log("last movingMean: " + meansData[1][meansData[1].length - 1]);

    let lowest = heartData[1][0];
    let lowestTime = heartData[0][0];
    for (let j = 0; j < heartData[1].length; j++) {
      if (heartData[1][j] < lowest) {
        lowest = heartData[1][j];
        lowestTime = heartData[0][j];
      }
    }
    console.log("lowest value: " + lowest + " at " + GraphComponent.datePipe.transform(lowestTime, "HH:mm"));

    let highest = heartData[1][0];
    let highestTime = heartData[0][0];
    for (let j = 0; j < heartData[1].length; j++) {
      if (heartData[1][j] > highest) {
        highest = heartData[1][j];
        highestTime = heartData[0][j];
      }
    }

    console.log("highest value: " + highest + " at " + highestTime);
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
                console.log(DataService.getHeartrateIntraday(response));
                let tempdata = DataService.getHeartrateIntraday(response);
                this.data = tempdata;
                
              });

          });
      }
    }
  }

//  title = 'Fitbit Project!';
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
