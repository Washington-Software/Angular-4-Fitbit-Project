import {Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/map';
import {PersistenceService, StorageType} from "angular-persistence";
import {DataService, HeartData, Sleep, UserSummary} from "../data.service";
import {DatePipe} from "@angular/common";
import * as CanvasJS from "./canvasjs.min";

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
  data;
  start;
  end;
  avg;
  analysis;

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
            this.start = tempArray[0];
            this.end = tempArray[1];
            this.dataService.getHeart(this.container.get("userID"), this.container.get("apiToken"), tempArray[0], tempArray[1], "1min").subscribe(
              (response: HeartData) => {
                console.log(response);
                console.log(DataService.getHeartrateIntraday(response));
                let tempdata = DataService.getHeartrateIntraday(response);
                this.data = tempdata;
                this.doStuff(this.data);
              });

          });
      }
    }
  }
  
  public static analyse(heartData: [Date[], number[]], meansData: [Date[], number[]]): void {
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

  doStuff = function(data) {
    var sum = 0;
    var i;
    for (i = 0; i < data[1].length; i++) {
      sum += data[1][i];
    }
    this.avg = sum / data[1].length;

    var movingMeans = [];
    var movingMeanTime = [];
    var movingMeanValue = [];
    var j;
    for (j = 5; j < data[1].length - 5; j++) {
      movingMeanTime.push(data[0][j]);
      movingMeanValue.push((data[1][j - 5] + data[1][j - 4] + data[1][j - 3] + data[1][j - 2] + data[1][j - 1] + data[1][j] + data[1][j + 1] + data[1][j + 2] + data[1][j + 3] + data[1][j + 4] + data[1][j + 5]) / 11);
    }
    movingMeans.push(movingMeanTime);
    movingMeans.push(movingMeanValue);
    this.graph(data, movingMeans);

    this.analysis = this.analyze(data, movingMeans);
  };


  graph = function(dates, movingMeans) {
//    var start = new Date(parseInt(dates[0][0].substring(0, 4)), parseInt(dates[0][0].substring(5, 7)) - 1, parseInt(dates[0][0].substring(8)), parseInt(dates[1][0].substring(0, 2)), parseInt(dates[1][0].substring(3, 5)), parseInt(dates[1][0].substring(6)));
//    var end = new Date(parseInt(dates[0][1].substring(0, 4)), parseInt(dates[0][1].substring(5, 7)) - 1, parseInt(dates[0][1].substring(8)), parseInt(dates[1][dates[1].length - 1].substring(0, 2)), parseInt(dates[1][dates[1].length - 1].substring(3, 5)), parseInt(dates[1][dates[1].length - 1].substring(6)));
    var datesPoints = [];
    var i;
    for (i = 0; i < dates[0].length; i++) {
      datesPoints.push({x: dates[0][i], y: dates[1][i]});
    }

    var datesPointsMM = [];
    var j;
    for (j = 0; j < movingMeans[0].length; j++) {
      datesPointsMM.push({x: movingMeans[0][j], y: movingMeans[1][j]});
    }

    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Sleeping Heart Rate from " + this.start + " to " + this.end,
      },
      axisY: {
        title: "BPM",
        includeZero: false,
        interval: 10,
        suffix: "",
        valueFormatString: "#"
      },
      data: [{
        type: "line",
        yValueFormatString: "",
        xValueFormatString: "HH:mm",
        markerSize: 5,

        dataPoints: datesPoints


      },
      {
        type: "line",
        yValueFormatString: "",
        xValueFormatString: "HH:mm",
        markerSize: 5,

        dataPoints: datesPointsMM


      }]
    });
    chart.render();

  }


  analyze = function(dates, movingMeans) {
    console.log("Date: " + this.end);
    console.log("first value: " + dates[1][0]);
    console.log("middle value: " + dates[1][Math.round(dates[1].length / 2)] + " at " + dates[0][Math.round(dates[1].length / 2)]);
    console.log("last value: " + dates[1][dates[1].length - 1]);
    console.log("first movingMean: " + movingMeans[1][0]);
    console.log("middle movingMean: " + movingMeans[1][Math.round(movingMeans[1].length / 2)]);
    console.log("last movingMean: " + movingMeans[1][movingMeans[1].length - 1]);

    var lowest = dates[1][0];
    var lowestTime = dates[0][0];
    var i;
    for (i in dates[1]) {
      if (dates[1][i] < lowest) {
        lowest = dates[1][i];
        lowestTime = dates[0][i];
      }
    }
    console.log("lowest value: " + lowest + " at " + lowestTime);

    var highest = dates[1][0];
    var highestTime = dates[0][0];
    var j;
    for (j in dates[1]) {
      if (dates[1][j] > highest) {
        highest = dates[1][j];
        highestTime = dates[0][j];
      }
    }
    console.log("highest value: " + highest + " at " + highestTime);


    var firstHalfMean;
    var firstHalfSum = 0;
    var k;
    for (k = 0; k <= ((dates[1].length) / 2); k++) {
      firstHalfSum += dates[1][k];
    }
    firstHalfMean = firstHalfSum / (dates[1].length / 2);
    console.log("firstHalfMean: " + firstHalfMean);

    var secondHalfMean;
    var secondHalfSum = 0;
    var k;
    for (k = dates[1].length - 1; k > ((dates[1].length) / 2); k--) {
      secondHalfSum += dates[1][k];
    }
    secondHalfMean = secondHalfSum / (dates[1].length / 2);
    console.log("secondHalfMean: " + secondHalfMean);


    var firstHalfMovingMean;
    var firstHalfMovingSum = 0;
    var h;
    for (h = 0; h <= ((movingMeans[1].length) / 2); h++) {
      firstHalfMovingSum += movingMeans[1][h];
    }
    firstHalfMovingMean = firstHalfMovingSum / (movingMeans[1].length / 2);
    console.log("firstHalfMovingMean: " + firstHalfMovingMean);

    var secondHalfMovingMean;
    var secondHalfMovingSum = 0;
    var h;
    for (h = movingMeans[1].length - 1; h > ((movingMeans[1].length) / 2); h--) {
      secondHalfMovingSum += movingMeans[1][h];
    }
    secondHalfMovingMean = secondHalfMovingSum / (movingMeans[1].length / 2);
    console.log("secondHalfMovingMean: " + secondHalfMovingMean);


    var firstQuarterMean;
    var firstQuarterSum = 0;
    var i;
    for (i = 0; i < Math.round((dates[1].length) / 4); i++) {
      firstQuarterSum += dates[1][i];
    }
    firstQuarterMean = firstQuarterSum / (dates[1].length / 4);
    console.log("firstQuarterMean: " + firstQuarterMean);

    var secondQuarterMean;
    var secondQuarterSum = 0;
    var i;
    for (i = Math.round(dates[1].length / 4); i < ((dates[1].length) / 2); i++) {
      secondQuarterSum += dates[1][i];
    }
    secondQuarterMean = secondQuarterSum / (dates[1].length / 4);
    console.log("secondQuarterMean: " + secondQuarterMean);

    var thirdQuarterMean;
    var thirdQuarterSum = 0;
    var i;
    for (i = Math.round(dates[1].length / 2); i < Math.round((dates[1].length) * 3 / 4); i++) {
      thirdQuarterSum += dates[1][i];
    }
    thirdQuarterMean = thirdQuarterSum / (dates[1].length / 4);
    console.log("thirdQuarterMean: " + thirdQuarterMean);

    var fourthQuarterMean;
    var fourthQuarterSum = 0;
    var i;
    for (i = Math.round(dates[1].length * 3 / 4); i < ((dates[1].length)); i++) {
      fourthQuarterSum += dates[1][i];
    }
    fourthQuarterMean = fourthQuarterSum / (dates[1].length / 4);
    console.log("fourthQuarterMean: " + fourthQuarterMean);


    var firstQuarterMovingMean;
    var firstQuarterMovingSum = 0;
    var i;
    for (i = 0; i < Math.round((movingMeans[1].length) / 4); i++) {
      firstQuarterMovingSum += movingMeans[1][i];
    }
    firstQuarterMovingMean = firstQuarterMovingSum / (movingMeans[1].length / 4);
    console.log("firstQuarterMovingMean: " + firstQuarterMovingMean);

    var secondQuarterMovingMean;
    var secondQuarterMovingSum = 0;
    var i;
    for (i = Math.round(movingMeans[1].length / 4); i < ((movingMeans[1].length) / 2); i++) {
      secondQuarterMovingSum += movingMeans[1][i];
    }
    secondQuarterMovingMean = secondQuarterMovingSum / (movingMeans[1].length / 4);
    console.log("secondQuarterMovingMean: " + secondQuarterMovingMean);

    var thirdQuarterMovingMean;
    var thirdQuarterMovingSum = 0;
    var i;
    for (i = Math.round(movingMeans[1].length / 2); i < Math.round((movingMeans[1].length) * 3 / 4); i++) {
      thirdQuarterMovingSum += movingMeans[1][i];
    }
    thirdQuarterMovingMean = thirdQuarterMovingSum / (movingMeans[1].length / 4);
    console.log("thirdQuarterMovingMean: " + thirdQuarterMovingMean);

    var fourthQuarterMovingMean;
    var fourthQuarterMovingSum = 0;
    var i;
    for (i = Math.round(movingMeans[1].length * 3 / 4); i < ((movingMeans[1].length)); i++) {
      fourthQuarterMovingSum += movingMeans[1][i];
    }
    fourthQuarterMovingMean = fourthQuarterMovingSum / (movingMeans[1].length / 4);
    console.log("fourthQuarterMovingMean: " + fourthQuarterMovingMean);

    //            hammock test
    if ((firstQuarterMean > secondQuarterMean) || ((secondQuarterMean - firstQuarterMean) < 0.75)) {
      if ((fourthQuarterMean > thirdQuarterMean) || ((thirdQuarterMean - fourthQuarterMean) < 0.75)) {
        return "Hammock—you had a good night's sleep!";
        //                    <!--if (dates[1][Math.round(dates[1].length/2)].substring(0,2)===lowestTime.substring(0,2)) {-->
        //                        <!--if (Math.abs(parseInt(dates[1][Math.round(dates[1].length/2)].substring(3,5))-parseInt(lowestTime.substring(3,5)))<15) {-->
        //                            <!---->
        //                        <!--}-->
        //                    <!--}-->
      }
    }

    //            downward slope test
    if ((firstQuarterMean > secondQuarterMean) && (thirdQuarterMean > fourthQuarterMean)) {
      if ((firstQuarterMean > thirdQuarterMean) && (secondQuarterMean > fourthQuarterMean)) {
        return "Downward Slope—your metabolism is working overtime. You may have had a late meal.";
      }
    }

    //            dune test
    if ((firstHalfMean > dates[1][0]) || (dates[1][0] - firstHalfMean) < 0.75) {
      if (secondQuarterMean > firstQuarterMean) {
        return "Dune—you may have slept later than usual.";
      }
    }

    //            random
    else {
      return "none";
    }

  }
}
