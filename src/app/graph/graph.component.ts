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
  public avg: number;
  public analysis: string;
  private chosen: string;
  private userFullName: string;
  private heartRateData: [Date[], number[]];
  private start: Date;
  private end: Date;

  constructor(private persistenceService: PersistenceService, private dataService: DataService) {
    this.container = persistenceService.createContainer('com.wasoftware.fitbit', {type: StorageType.SESSION});
  }

  /**
   * Analyzes the heart rate data by providing statistics used to define the pattern of sleep.
   * @param {[Date[], number[]]} heartData An array containing the time and values for each heart rate data point.
   * @param {[Date[], number[]]} meansData An array containing the time and values for the moving mean of the heart rate data points.
   */
  public static analyse(heartData: [Date[], number[]], meansData: [Date[], number[]]): string {
    console.log("Date: " + GraphComponent.datePipe.transform(heartData[0][0], "yyyy-MM-dd"));
    console.log("first value: " + heartData[1][0]);
    console.log("middle value: " + heartData[1][Math.floor(heartData[1].length / 2)] + " at " + GraphComponent.datePipe.transform(heartData[0][Math.floor(heartData[1].length / 2)], "HH:mm"));
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

    let firstHalfSum = 0;
    for (let i = 0; i < (heartData[1].length / 2); i++) {
      firstHalfSum += heartData[1][i];
    }
    let firstHalfMean = firstHalfSum / (heartData[1].length / 2);
    console.log("firstHalfMean: " + firstHalfMean);

    let secondHalfSum = 0;
    for (let i = heartData[1].length - 1; i > ((heartData[1].length) / 2); i--) {
      secondHalfSum += heartData[1][i];
    }
    let secondHalfMean = secondHalfSum / (heartData[1].length / 2);
    console.log("secondHalfMean: " + secondHalfMean);

    let firstHalfMovingSum = 0;
    for (let i = 0; i <= ((meansData[1].length) / 2); i++) {
      firstHalfMovingSum += meansData[1][i];
    }
    let firstHalfMovingMean = firstHalfMovingSum / (meansData[1].length / 2);
    console.log("firstHalfMovingMean: " + firstHalfMovingMean);

    let secondHalfMovingSum = 0;
    for (let h = meansData[1].length - 1; h > ((meansData[1].length) / 2); h--) {
      secondHalfMovingSum += meansData[1][h];
    }
    let secondHalfMovingMean = secondHalfMovingSum / (meansData[1].length / 2);
    console.log("secondHalfMovingMean: " + secondHalfMovingMean);

    let firstQuarterSum = 0;
    for (let i = 0; i < Math.round((heartData[1].length) / 4); i++) {
      firstQuarterSum += heartData[1][i];
    }
    let firstQuarterMean = firstQuarterSum / (heartData[1].length / 4);
    console.log("firstQuarterMean: " + firstQuarterMean);

    let secondQuarterSum = 0;
    for (let i = Math.round(heartData[1].length / 4); i < ((heartData[1].length) / 2); i++) {
      secondQuarterSum += heartData[1][i];
    }
    let secondQuarterMean = secondQuarterSum / (heartData[1].length / 4);
    console.log("secondQuarterMean: " + secondQuarterMean);

    let thirdQuarterSum = 0;
    for (let i = Math.round(heartData[1].length / 2); i < Math.round((heartData[1].length) * 3 / 4); i++) {
      thirdQuarterSum += heartData[1][i];
    }
    let thirdQuarterMean = thirdQuarterSum / (heartData[1].length / 4);
    console.log("thirdQuarterMean: " + thirdQuarterMean);

    let fourthQuarterSum = 0;
    for (let i = Math.round(heartData[1].length * 3 / 4); i < ((heartData[1].length)); i++) {
      fourthQuarterSum += heartData[1][i];
    }
    let fourthQuarterMean = fourthQuarterSum / (heartData[1].length / 4);
    console.log("fourthQuarterMean: " + fourthQuarterMean);

    let firstQuarterMovingSum = 0;
    for (let i = 0; i < Math.round((meansData[1].length) / 4); i++) {
      firstQuarterMovingSum += meansData[1][i];
    }
    let firstQuarterMovingMean = firstQuarterMovingSum / (meansData[1].length / 4);
    console.log("firstQuarterMovingMean: " + firstQuarterMovingMean);

    let secondQuarterMovingSum = 0;
    for (let i = Math.round(meansData[1].length / 4); i < ((meansData[1].length) / 2); i++) {
      secondQuarterMovingSum += meansData[1][i];
    }
    let secondQuarterMovingMean = secondQuarterMovingSum / (meansData[1].length / 4);
    console.log("secondQuarterMovingMean: " + secondQuarterMovingMean);

    let thirdQuarterMovingSum = 0;
    for (let i = Math.round(meansData[1].length / 2); i < Math.round((meansData[1].length) * 3 / 4); i++) {
      thirdQuarterMovingSum += meansData[1][i];
    }
    let thirdQuarterMovingMean = thirdQuarterMovingSum / (meansData[1].length / 4);
    console.log("thirdQuarterMovingMean: " + thirdQuarterMovingMean);

    let fourthQuarterMovingSum = 0;
    for (let i = Math.round(meansData[1].length * 3 / 4); i < ((meansData[1].length)); i++) {
      fourthQuarterMovingSum += meansData[1][i];
    }
    let fourthQuarterMovingMean = fourthQuarterMovingSum / (meansData[1].length / 4);
    console.log("fourthQuarterMovingMean: " + fourthQuarterMovingMean);

    // Testing if the pattern is a hammock
    if ((firstQuarterMean > secondQuarterMean) || ((secondQuarterMean - firstQuarterMean) < 0.75)) {
      if ((fourthQuarterMean > thirdQuarterMean) || ((thirdQuarterMean - fourthQuarterMean) < 0.75)) {
        return "Hammock — you had a good night's sleep!";
      }
    }
    // Testing if the pattern is a downward slope
    if ((firstQuarterMean > secondQuarterMean) && (thirdQuarterMean > fourthQuarterMean)) {
      if ((firstQuarterMean > thirdQuarterMean) && (secondQuarterMean > fourthQuarterMean)) {
        return "Downward Slope — your metabolism is working overtime. You may have had a late meal.";
      }
    }
    // Testing if the pattern is a dune
    if ((firstHalfMean > heartData[1][0]) || (heartData[1][0] - firstHalfMean) < 0.75) {
      if (secondQuarterMean > firstQuarterMean) {
        return "Dune — you may have slept later than usual.";
      }
    }
    //Unknown
    else {
      return "No known pattern found.";
    }
  }

  /**
   * Creates the moving mean array using the data array
   * @param {[Date[], number[]]} data An array containing the time and values for each heart rate data point
   */
  public calculateMeans(data: [Date[], number[]]): void {
    let sum = 0;
    for (let i = 0; i < data[1].length; i++) {
      sum += data[1][i];
    }
    this.avg = Math.round((sum / data[1].length) * 100) / 100;

    let movingMeans: [Date[], number[]] = [[], []];
    let movingMeanTime: Date[] = [];
    let movingMeanValue: number[] = [];

    for (let j = 5; j < data[1].length - 5; j++) {
      movingMeanTime.push(data[0][j]);
      movingMeanValue.push((data[1][j - 5] + data[1][j - 4] + data[1][j - 3] + data[1][j - 2] + data[1][j - 1] + data[1][j] + data[1][j + 1] + data[1][j + 2] + data[1][j + 3] + data[1][j + 4] + data[1][j + 5]) / 11);
    }

    movingMeans[0] = movingMeanTime;
    movingMeans[1] = movingMeanValue;

    // graphing the data points and moving mean
    this.graph(data, movingMeans);
    // analyzing the data
    this.analysis = GraphComponent.analyse(data, movingMeans);
  }

  /**
   * Produces a line graph using the times and values of each heart rate data point.
   *
   * @param {[Date[], number[]]} hrData An array of heartrate points and `Date` points
   * @param {[Date[], number[]]} movingMeans An array of moving means points and `Date` points
   */
  public graph(hrData: [Date[], number[]], movingMeans: [Date[], number[]]): void {
    let hrPoints = [];
    for (let i = 0; i < hrData[0].length; i++) {
      hrPoints.push({x: hrData[0][i], y: hrData[1][i]});
    }

    let datesPointsMM = [];
    for (let j = 0; j < movingMeans[0].length; j++) {
      datesPointsMM.push({x: movingMeans[0][j], y: movingMeans[1][j]});
    }

    new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Sleeping Heart Rate from " + GraphComponent.datePipe.transform(this.start, "yyyy-MM-dd HH:mm") + " to " + GraphComponent.datePipe.transform(this.end, "yyyy-MM-dd HH:mm") + " for " + this.userFullName,
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
        dataPoints: hrPoints
      },
        {
          type: "line",
          yValueFormatString: "",
          xValueFormatString: "HH:mm",
          markerSize: 5,
          dataPoints: datesPointsMM
        }]
    }).render();
  }

  ngOnInit(): void {
    if (this.container.get("apiToken") != null) {
      this.dataService.getProfile(this.container.get("userID"), this.container.get("apiToken")).subscribe((response: UserSummary) => {
        this.userSummary = response;
        this.userFullName = this.userSummary.user.fullName;
      });
      if (this.chosen != null) {
        this.dataService.getSleep(this.container.get("userID"), this.container.get("apiToken"), new Date(this.chosen)).subscribe(
          (response: Sleep) => {
            let tempArray = DataService.getSleepStartAndEnd(response);
            this.start = tempArray[0];
            this.end = tempArray[1];
            this.dataService.getHeart(this.container.get("userID"), this.container.get("apiToken"), tempArray[0], tempArray[1], "1min").subscribe(
              (response: HeartData) => {
                this.heartRateData = DataService.getHeartrateIntraday(response);
                this.calculateMeans(this.heartRateData);
              });
          });
      }
    }
  }


  /**
   * Called when the user submits a date with the datepicker.
   * Defines the chosen date to call the Fitbit API to get the heart rate data for the chosen date.
   */
  public getAndGraph(): void {
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
