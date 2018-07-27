import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {_throw} from "rxjs/observable/throw";
import {catchError, retry} from "rxjs/operators";
import {DatePipe} from "@angular/common";

@Injectable()
export class DataService {
  private baseurl: string = "https://api.fitbit.com/1/user/";

  constructor(private http: HttpClient, private datepipe: DatePipe) {
  }

  public getProfile(userID: string, apiKey: string) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + apiKey); //Construct authorisation header
    return this.http.get<User>(this.baseurl + userID + "/profile.json", {headers: headers}).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  public getSleep(userID: string, apiKey: string, date: Date) {
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Bearer " + apiKey); //Construct authorisation header
    let formattedDate = this.datepipe.transform(date, "yyyy-MM-dd");
    return this.http.get<Sleep>(this.baseurl + userID + "/sleep/date/" + formattedDate + "profile.json", {headers: headers})
      .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

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

export interface User {
  aboutMe: string;
  avatar: string;
  avatar150: string;
  avatar640: string;
  city: string;
  clockTimeDisplayFormat: string;
  country: string;
  dateOfBirth: string;
  displayName: string;
  distanceUnit: string;
  encodedId: string;
  foodsLocale: string;
  fullName: string;
  gender: string;
  glucoseUnit: string;
  height: string;
  heightUnit: string;
  locale: string;
  memberSince: string;
  offsetFromUTCMillis: number;
  startDayOfWeek: string;
  state: string;
  strideLengthRunning: string;
  strideLengthWalking: string;
  timezone: string;
  waterUnit: string;
  weight: number;
  weightUnit: string;
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
