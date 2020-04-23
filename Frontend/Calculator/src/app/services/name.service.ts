import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from "@angular/common/http";

import { throwError } from "rxjs";
import { API_URL } from "../env";
import * as X2JS from "x2js";
import * as moment from "moment";

declare var require: any;

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}


const httpOptions = {
  headers: new HttpHeaders({
    Accept: "text/xml, application/json, application/xml",
    "Content-Type": "application/json"
  })
};

const XMLoptions = {
  headers: new HttpHeaders({
    Accept: "text/xml, application/json, application/xml",
    "Content-Type": "application/json"
  }),
  responseType: "text" as "text"
};

@Injectable({
  providedIn: "root"
})
export class NameService {
  constructor(private http: HttpClient) {}

  tokendata: any;
  x2js = new X2JS();
  ready: any;

  sendName(name: string) {
    if (name.match(/^[A-M].*/) || name.match(/^[a-m].*/)) {
      var data = { username: name };
      return this.http
        .post(`${API_URL}/login`, JSON.stringify(data), httpOptions)
        .subscribe(data => {
          this.tokendata = data;
          this.setSession(data);
          console.log(this.tokendata);

          //  console.log(response);
        });
    } else {
      var data = { username: name };
      return this.http
        .post(`${API_URL}/login`, JSON.stringify(data), XMLoptions)
        .subscribe(data => {
          this.tokendata = data;
          var obj = this.x2js.xml2js(this.tokendata);
          //console.log(jsonObj)
          this.setSession(obj);
          console.log(this.tokendata);
        });
    }
  }

  getReadyState(name: string){
    const httpOptionsAuth = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }).set("Authorization", "Bearer " + localStorage.getItem("access_token"))
    };

    const XMLoptions = {
      headers: new HttpHeaders({
        Accept: "text/xml, application/json, application/xml",
        "Content-Type": "application/json"
      })
      .set('Authorization', "Bearer "+ localStorage.getItem("access_token")),
      responseType: "text" as "text"
    };

    if (name.match(/^[A-M].*/) || name.match(/^[a-m].*/)) {
     return this.http.get(`${API_URL}/ready`, httpOptionsAuth).subscribe((data) => {
       this.ready = data
       console.info(this.ready)
     })

    }
    else{
      this.http.get(`${API_URL}/ready`, XMLoptions).subscribe((data) => {
        this.ready = this.x2js.xml2js(data)
        console.info(this.ready)
      })
    }
  }

  private setSession(authResult) {
    localStorage.setItem("access_token", authResult.token.access_token);
    localStorage.setItem("exp", authResult.token.exp);
    localStorage.setItem("type", authResult.token.type);
    console.log(localStorage.getItem("access_token"));
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
    localStorage.removeItem("user");
  }

  getExpiration() {
    const expiration = localStorage.getItem("exp");
    const expiresAt = JSON.parse(expiration);
    return moment.unix(expiresAt).toDate();
  }



  fetchReady(name: string){
    this.ready = this.getReadyState(name)
    return JSON.stringify(this.ready.Result);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }
}
