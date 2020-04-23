import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError } from 'rxjs';
import {API_URL} from '../env';
import * as X2JS from "x2js";

@Injectable({
  providedIn: 'root'
})
export class CalculatorService  {
  response: any;
  x2js = new X2JS();

  constructor(private http: HttpClient) { }

  sendOperations(op: string, operand: number, operand2?: number){

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
      .set('Authorization', "Bearer "+ localStorage.getItem("access_token"))
    };

    const XMLoptions = {
      headers: new HttpHeaders({
        Accept: "text/xml, application/json, application/xml",
        "Content-Type": "application/json"
      })
      .set('Authorization', "Bearer "+ localStorage.getItem("access_token")),
      responseType: "text" as "text"
    };

    switch (op){
      case '+':
        var data = { "x": operand, "y": operand2 };
        var name = localStorage.getItem("user");
        if (name.match(/^[A-M].*/) || name.match(/^[a-m].*/)) {
          return this.http.post(`${API_URL}/add`, JSON.stringify(data), httpOptions).subscribe(
            (data) => {
              this.response = data;

            }
          )
        }

        else{
          return this.http.post(`${API_URL}/add`, JSON.stringify(data), XMLoptions).subscribe(
            (data) => {
              this.response = data;
              this.response = this.x2js.xml2js(this.response);
            }
          )
        }

      case '-':
        var data = { "x": operand, "y": operand2 };
        var name = localStorage.getItem("user");
        if (name.match(/^[A-M].*/) || name.match(/^[a-m].*/)) {
          return this.http.post(`${API_URL}/sub`, JSON.stringify(data), httpOptions).subscribe(
            (data) => {
              this.response = data;

            }
          )
        }

        else{
          return this.http.post(`${API_URL}/sub`, JSON.stringify(data), XMLoptions).subscribe(
            (data) => {
              this.response = data;
              this.response = this.x2js.xml2js(this.response);
            }
          )
        }

      case '*':
        var data = { "x": operand, "y": operand2 };
        var name = localStorage.getItem("user");
        if (name.match(/^[A-M].*/) || name.match(/^[a-m].*/)) {
          return this.http.post(`${API_URL}/multi`, JSON.stringify(data), httpOptions).subscribe(
            (data) => {
              this.response = data;

            }
          )
        }

        else{
          return this.http.post(`${API_URL}/multi`, JSON.stringify(data), XMLoptions).subscribe(
            (data) => {
              this.response = data;
              this.response = this.x2js.xml2js(this.response);
            }
          )
        }

      case '/':
        var data = { "x": operand, "y": operand2 };
        var name = localStorage.getItem("user");
        if (name.match(/^[A-M].*/) || name.match(/^[a-m].*/)) {
          return this.http.post(`${API_URL}/divide`, JSON.stringify(data), httpOptions).subscribe(
            (data) => {
              this.response = data;

            }
          )
        }

        else{
          return this.http.post(`${API_URL}/divide`, JSON.stringify(data), XMLoptions).subscribe(
            (data) => {
              this.response = data;
              this.response = this.x2js.xml2js(this.response);
            }
          )
        }

      case 'sqrt':

        var singledata = { "x": operand }
        var name = localStorage.getItem("user");
        if (name.match(/^[A-M].*/) || name.match(/^[a-m].*/)) {
          return this.http.post(`${API_URL}/sqrt`, JSON.stringify(singledata), httpOptions).subscribe(
            (singledata) => {
              this.response = singledata;

            }
          )
        }

        else{
          return this.http.post(`${API_URL}/sqrt`, JSON.stringify(singledata), XMLoptions).subscribe(
            (singledata) => {
              this.response = singledata;
              this.response = this.x2js.xml2js(this.response);
            }
          )
        }

      case 'ln':
        var singledata = { "x": operand }
        var name = localStorage.getItem("user");
        if (name.match(/^[A-M].*/) || name.match(/^[a-m].*/)) {
          return this.http.post(`${API_URL}/natlog`, JSON.stringify(singledata), httpOptions).subscribe(
            (singledata) => {
              this.response = singledata;

            }
          )
        }

        else{
          return this.http.post(`${API_URL}/natlog`, JSON.stringify(singledata), XMLoptions).subscribe(
            (singledata) => {
              this.response = singledata;
              this.response = this.x2js.xml2js(this.response);
              console.log(this.response);
            }
          )
        }

      case 'exp':
        var singledata = { "x": operand }
        var name = localStorage.getItem("user");
        if (name.match(/^[A-M].*/) || name.match(/^[a-m].*/)) {
          return this.http.post(`${API_URL}/exponential`, JSON.stringify(singledata), httpOptions).subscribe(
            (singledata) => {
              this.response = singledata;

            }
          )
        }

        else{
          return this.http.post(`${API_URL}/exponential`, JSON.stringify(singledata), XMLoptions).subscribe(
            (singledata) => {
              this.response = singledata;
              this.response = this.x2js.xml2js(this.response);
            }
          )
        }

      case '!':
        var singledata = { "x": operand }
        var name = localStorage.getItem("user");
        if (name.match(/^[A-M].*/) || name.match(/^[a-m].*/)) {
          return this.http.post(`${API_URL}/factorial`, JSON.stringify(singledata), httpOptions).subscribe(
            (singledata) => {
              this.response = singledata;
            }
          )
        }

        else{
          return this.http.post(`${API_URL}/factorial`, JSON.stringify(singledata), XMLoptions).subscribe(
            (singledata) => {
              this.response = singledata;
              this.response = this.x2js.xml2js(this.response);
            }
          )
        }
    }
  }

  fetchResponse(){
    console.log(JSON.stringify(this.response.Result).replace(/\"/g,""));
    return JSON.stringify(this.response.Result).replace(/\"/g,"")

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
