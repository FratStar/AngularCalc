import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { defer, Observable, throwError, fromEventPattern } from "rxjs";
import { finalize, tap, shareReplay } from "rxjs/operators";
import { API_URL } from '../env';
import * as X2JS from 'x2js';
import * as moment from 'moment';

declare var require: any

const httpOptions = {
  headers: new HttpHeaders({
    'Accept': 'text/xml, application/json, application/xml',
    'Content-Type':  'application/json'
  })
};


const XMLoptions = {
  headers: new HttpHeaders({
    'Accept': 'text/xml, application/json, application/xml',
    'Content-Type': 'application/json'}),
  responseType: 'text' as 'text'
};


@Injectable({
  providedIn: 'root'
})

export class NameService {

  constructor(private http: HttpClient) { }

  tokendata: any;
  x2js = new X2JS();
  parseString = require('xml2js').parseString;

  sendName(name: string){
    if (name.match(/^[A-M].*/) || name.match(/^[a-m].*/)){
        var data = { "username": name};
        console.log(data);
      return this.http.post(`${API_URL}/login`, JSON.stringify(data), httpOptions).subscribe(
          (data) => {
            this.tokendata = data;
            this.setSession(data);
          //  console.log(this.tokendata);

          //  console.log(response);
          });
    }
    else{
      var data = {"username": name};
      return this.http.post(`${API_URL}/login`,JSON.stringify(data), XMLoptions).subscribe(
        (data) => {
          this.tokendata = data;
          var obj = this.x2js.xml2js(this.tokendata);
          //console.log(jsonObj)
          this.setSession(obj);
          //console.log(this.tokendata);
        });
    }
  }


  private setSession(authResult) {

    localStorage.setItem('access_token', authResult.token.access_token);
    localStorage.setItem('exp', authResult.token.exp);
    localStorage.setItem('type', authResult.token.type);
    console.log(localStorage.getItem('access_token'));
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("exp");
    localStorage.removeItem("type");
  }

  getExpiration(){
    const expiration = localStorage.getItem("exp");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt)
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
    return throwError(
      'Something bad happened; please try again later.');
  };
}
