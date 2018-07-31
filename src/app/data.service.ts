import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {_throw} from "rxjs/observable/throw";
import {catchError, retry} from "rxjs/operators";
import {DatePipe} from "@angular/common";
import {Observable} from "rxjs";

@Injectable()
export class DataService {
  // Base URLs for API points
  private v1BaseUrl: string = "https://api.fitbit.com/1/user/";
  private v2BaseUrl: string = "https://api.fitbit.com/1.2/user/";

  /**
   * Constructor. Doesn't do anything, except inject dependencies.
   * 
   * @param {HttpClient} http An `HttpClient` used to make requests to the API
   * @param {DatePipe} datepipe A `DatePipe` used to format `Date` objects to the correct `string` format.
   */
  constructor(private http: HttpClient, private datepipe: DatePipe) {
  }

  /**
   * Accepts a Sleep object and determines the start date/time and the end date/time of the main sleep, returning both
   * `Date` objects in an array as `[start, end]`.
   *
   * Works with sleeps that cross the day boundary.
   *
   * @param {Sleep} sleep A Sleep object to manipulate
   * @return {Date[]} An array of two `Date` objects
   */
  public static getSleepStartAndEnd(sleep: Sleep): Date[] {
    let sleepInst: SleepInstance;
    for (let i = 0; i < sleep.sleep.length; i++) {
      if (sleep.sleep[i].isMainSleep) {
        sleepInst = sleep.sleep[i];
        break;
      }
    }
    let startDate: Date = new Date(sleepInst.startTime);
    let endDate: Date = new Date(sleepInst.startTime);
    endDate.setMilliseconds(endDate.getMilliseconds() + sleepInst.duration);
    return [startDate, endDate];
  }

  /**
   * Accepts a `HeartData` object and converts it into an appropriate format for graphing the sleep curve.
   *
   * TODO: Test this on actual API
   *
   * @param {HeartData} heartData
   * @return {[Date[], number[]]} An array containing an array of `Date` objects and an array of `number`s.
   */
  public static getHeartrateIntraday(heartData: HeartData): [Date[], number[]] {
    let intradayArray = heartData["activities-heart-intraday"].dataset;
    let dateArray: Date[] = [];
    let beatArray: number[] = [];
    for (let i = 0; i < intradayArray.length; i++) {
      let tempArray = intradayArray[i];
      dateArray.push(new Date(tempArray.time));
      beatArray.push(tempArray.value);
    }
    return [dateArray, beatArray]
  }

  /**
   * Gets the profile from Fitbit's API using the user's ID and the proper API access token. Uses `HttpClient`'s `get`
   * method to get the JSON file, and properly types it to a `UserSummary` object.
   *
   * @param {string} userID The Fitbit ID of the user to get
   * @param {string} apiKey The API key to use to authenticate with the API
   * @return {Observable<UserSummary>} An `Observable` that emits a UserSummary object
   */
  public getProfile(userID: string, apiKey: string): Observable<UserSummary> {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + apiKey); //Construct authorisation header
    return this.http.get<UserSummary>(this.v1BaseUrl + userID + "/profile.json", {headers: headers}).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Gets one day's worth of sleep data from the Fitbit API for the specified user. Uses `HttpClient`'s `get`, and types
   * the response to a `Sleep` object.
   *
   * @param {string} userID The user ID to get sleep data for
   * @param {string} apiKey The API key to use in authentication
   * @param {Date} date The date to get sleep data for
   * @return {Observable<Sleep>} An observable that emits a `Sleep` object
   */
  public getSleep(userID: string, apiKey: string, date: Date): Observable<Sleep> {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + apiKey); //Construct authorisation header
    let formattedDate = this.datepipe.transform(date, "yyyy-MM-dd");
    return this.http.get<Sleep>(this.v2BaseUrl + userID + "/sleep/date/" + formattedDate + ".json", {headers: headers})
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  /**
   * Gets intraday heart rate data from the Fitbit API for the specified user. The user **must** be the owner of the app,
   * and the app should be set to `Personal` within the Fitbit application settings at `dev.fitbit.com`. If either of
   * these conditions are not met, the query will fail.
   *
   * @param {string} userID The user ID to get sleep data for
   * @param {string} apiKey The API key to use in authentication
   * @param {Date} startDate The start date and time to get data from
   * @param {Date} endDate The end date and time to get data to
   * @param {string} detailLevel Either `1sec` or `1min`, determines how detailed the response data is
   * @return {Observable<HeartData>} An `Observable` that emits a HeartData object
   */
  public getHeart(userID: string, apiKey: string, startDate: Date, endDate: Date, detailLevel: string): Observable<HeartData> {
    if (!(detailLevel === <string>"1sec" || detailLevel === <string>"1min")) {
      throw Error("Improper detailLevel. Expected '1sec' or '1min' but got " + detailLevel + ".");
    }
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + apiKey); //Construct authorisation header
    let formattedStartDate = this.datepipe.transform(startDate, "yyyy-MM-dd");
    let formattedEndDate = this.datepipe.transform(endDate, "yyyy-MM-dd");
    let formattedStartTime = this.datepipe.transform(startDate, "HH:mm");
    let formattedEndTime = this.datepipe.transform(endDate, "HH:mm");
    console.log(startDate);
    console.log(endDate);
    console.log(this.v1BaseUrl + userID + "/activities/heart/date/" + formattedStartDate + "/" +
      formattedEndDate + "/" + detailLevel + "/time/" + formattedStartTime + "/" + formattedEndTime +
      ".json");
    return this.http.get<HeartData>(this.v1BaseUrl + userID + "/activities/heart/date/" + formattedStartDate + "/" +
      formattedEndDate + "/" + detailLevel + "/time/" + formattedStartTime + "/" + formattedEndTime +
      ".json", {headers: headers})
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  /**
   * Error handling method for `HttpErrorResponse`s produced by `get` requests.
   *
   * @param {HttpErrorResponse} error The error to handle
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return _throw(
      'Something bad happened; please try again later.');
  }

}

// Interfaces used in properly typing HTTP get requests.

export interface UserSummary {
  user: User
}

export interface User {
  age: number
  ambassador: boolean
  avatar: string
  avatar150: string
  avatar640: string
  averageDailySteps: number
  clockTimeDisplayFormat: string
  corporate: number
  corporateAdmin: number
  dateOfBirth: string
  displayName: string
  displayNameSetting: string
  distanceUnit: string
  encodedId: string
  familyGuidanceEnabled: boolean
  features: any
  firstName: string
  fullName: string
  gender: string
  glucoseUnit: string
  height: number
  heightUnit: string
  isChild: boolean
  isGraduationAvailable: boolean
  lastName: string
  locale: string
  memberSince: string
  mfaEnabled: boolean
  offsetFromUTCMillis: number
  startDayOfWeek: string
  strideLengthRunning: number
  strideLengthRunningType: string
  strideLengthWalking: number
  strideLengthWalkingType: string
  swimUnit: string
  timezone: string
  topBadges: badgeInstance[]
  weight: number
  weightUnit: string
}

export interface Sleep {
  sleep: SleepInstance[];
  summary: Summary;
}

export interface SleepInstance {
  dateOfSleep: string;
  duration: number;
  efficiency: number;
  isMainSleep: boolean;
  levels: SleepLevels;
  logId: number;
  minutesAfterWakeup: number;
  minutesAsleep: number;
  minutesAwake: number;
  minutesToFallAsleep: number;
  startTime: string;
  timeInBed: number;
  type: string;
}

export interface SleepLevels {
  summary: SleepSummary;
  data: SleepEvent[];
  shortData: SleepEvent[];
}

export interface SleepSummary {
  deep: SleepSummaryInstance;
  light: SleepSummaryInstance;
  rem: SleepSummaryInstance;
  wake: SleepSummaryInstance;
}

export interface SleepSummaryInstance {
  count: number;
  minutes: number;
  thirtyDayAvgMinutes: number;
}

export interface SleepEvent {
  datetime: string;
  level: string;
  seconds: number;
}

export interface Summary {
  totalMinutesAsleep: number;
  totalSleepRecords: number;
  totalTimeInBed: number;
}

export interface HeartData {
  'activities-heart': HeartDataSummary;
  'activities-heart-intraday': HeartDataIntraday;
}

export interface HeartDataSummary {
  customHeartRateZones: string[];
  dateTime: string;
  heartRateZones: HeartRateZones[];
  value: string;
}

export interface HeartRateZones {
  caloriesOut: number;
  max: number;
  min: number;
  minutes: number;
  name: string;
}

export interface HeartDataIntraday {
  dataset: datasetInstance[];
  datasetInterval: number;
  datasetType: string;
}

export interface datasetInstance {
  time: string;
  value: number;
}

export interface badgeInstance {
  badgeGradientEndColor: string
  badgeGradientStartColor: string
  badgeType: string
  category: string
  cheers: any
  dateTime: string
  description: string
  earnedMessage: string
  encodedId: string
  image50px: string
  image75px: string
  image100px: string
  image125px: string
  image300px: string
  marketingDescription: string
  mobileDescription: string
  name: string
  shareImage640px: string
  shareText: string
  shortDescription: string
  shortName: string
  timesAchieved: number
  value: number
}
