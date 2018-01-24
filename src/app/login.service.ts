import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  private baseUrl = 'http://cookie-jar-be.herokuapp.com/api/session/';
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, withCredentials: true });

  constructor(private http: Http) { }

  loginUser(endpoint: String, record: any): Observable<any> {
    const apiUrl = `${this.baseUrl}${endpoint}`;
    return this.http.put(apiUrl, record, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  logoutUser(endpoint: String): Observable<any> {
    const apiUrl = `${this.baseUrl}${endpoint}`;
    return this.http.delete(apiUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUserSessionId(): Observable<any> {
    const apiUrl = `${this.baseUrl}/login`;
    return this.http.get(apiUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    const results = res.json();
    return results || [];
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error.status === 403) {
      errMsg = 'Invalid Credentials';
    } else if (typeof error._body === 'string') {
      errMsg = error._body;
    } else {
      if (error instanceof Response) {
        if (error.status === 0) {
          errMsg = 'Error connecting to API';
        } else {
          const errorJSON = error.json();
          errMsg = errorJSON.message;
        }
      }
    }
    return Observable.throw(errMsg);
  }

}
