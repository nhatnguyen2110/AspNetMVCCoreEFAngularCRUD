import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpServerService {
  private httpGetOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //'Authorization': 'my-auth-token'
    })
  };
  private httpPostOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      //'Authorization': 'my-auth-token'
    })
  };
  public REST_API_SERVER = 'http://localhost:57467';
  constructor(private httpClient: HttpClient) { }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
  public getHttpRequest(methodName: string, data): Observable<any> {
    const url = `${this.REST_API_SERVER}/${methodName}`;
    return this.httpClient
      .get<any>(url, { params: data, headers: this.httpGetOptions.headers })
      .pipe(catchError(this.handleError));
  }
  public postHttpRequest(methodName: string, data): Observable<any> {
    const url = `${this.REST_API_SERVER}/${methodName}`;
    return this.httpClient
      .post<any>(url, new HttpParams({fromObject: data}).toString(), this.httpPostOptions)
      .pipe(catchError(this.handleError));
   
  }
  public getPureHttpRequest(url: string, data, header): Observable<any> {
    return this.httpClient
      .get<any>(url, { params: data, headers: header })
      .pipe(catchError(this.handleError));
  }
}
