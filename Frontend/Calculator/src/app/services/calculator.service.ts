import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import {API_URL} from '../env';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
  .set('Authorization', "Bearer "+ localStorage.getItem("access_token"))
};

const XMLoptions = {
  headers: new HttpHeaders({
    'Accept': 'text/xml, application/json, application/xml',
    'Content-Type': 'application/json'}).set('Authorization', "Bearer " + localStorage.getItem("access_token")),
  responseType: 'text' as 'text'
};

@Injectable({
  providedIn: 'root'
})
export class CalculatorService  {

  response: any;

  constructor(private http: HttpClient) { }

  sendOperations(op: string, operand: number, operand2?: number){

    switch (op){
      case '+':
        var data = { "x": operand, "y": operand2 };
        return this.http.post(`${API_URL}/add`, JSON.stringify(data), httpOptions).subscribe(
          (data) => {
            this.response = data;

          }
        )

      case '-':
        var data = { "x": operand, "y": operand2 };
        return this.http.post(`${API_URL}/sub`, JSON.stringify(data), httpOptions).subscribe(
          (data) => {
            this.response = data;
          }
        )

      case '*':
        var data = { "x": operand, "y": operand2 };
        return this.http.post(`${API_URL}/multi`, JSON.stringify(data), httpOptions).subscribe(
          (data) => {
            this.response = data;
          }
        )

      case '/':
        var data = { "x": operand, "y": operand2 };
        return this.http.post(`${API_URL}/divide`, JSON.stringify(data), httpOptions).subscribe(
          (data) => {
            this.response = data;
          }
        )

      case 'sqrt':
        var singledata = { "x": operand }
        return this.http.post(`${API_URL}/sqrt`, JSON.stringify(singledata), httpOptions).subscribe(
          (singledata) => {
            this.response = singledata;
          }
        )


      case 'ln':
        var singledata = { "x": operand }
        return this.http.post(`${API_URL}/natlog`, JSON.stringify(singledata), httpOptions).subscribe(
          (singledata) => {
            this.response = singledata;
          }
        )


      case 'exp':
        var singledata = { "x": operand }
        return this.http.post(`${API_URL}/exponential`, JSON.stringify(singledata), httpOptions).subscribe(
          (singledata) => {
            this.response = singledata;
          }
        )


      case '!':
        var singledata = { "x": operand }
        return this.http.post(`${API_URL}/factorial`, JSON.stringify(singledata), httpOptions).subscribe(
          (singledata) => {
            this.response = singledata;
          }
        )
    }
  }

  fetchResponse(){
    console.log(JSON.stringify(this.response.Result))
    return JSON.stringify(this.response.Result)

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
