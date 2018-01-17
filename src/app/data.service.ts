import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  private baseUrl = 'http://localhost:8080/api/';

  constructor(private http: Http) { }
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers, withCredentials: true });

  getRecords(endpoint: string): Observable<any[]> {
    const apiUrl = this.baseUrl + endpoint;
    return this.http.get(apiUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getRecord(endpoint: string, id): Observable<object> {
    const apiUrl = `${this.baseUrl}${endpoint}/${id}`;
    return this.http.get(apiUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteRecord(endpoint: string, id: number): Observable<object> {
    const apiUrl = `${this.baseUrl}${endpoint}/${id}`;
    return this.http.delete(apiUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  editRecord(endpoint: string, record: object, id: number): Observable<object> {
    const apiUrl = `${this.baseUrl}${endpoint}/${id}`;
    return this.http.put(apiUrl, record, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  addRecord(endpoint: string, record: any): Observable<any> {
    const apiUrl = `${this.baseUrl}${endpoint}`;
    return this.http.post(apiUrl, record, this.options)
      .map(this.extractData);
  }

  searchForRecipes(endpoint: string): Observable<any> {
    const apiUrl = `${this.baseUrl}recipes?name=${endpoint}`;
    return this.http.get(apiUrl, this.options)
    .map(result => {
      return result.json();
    });
  }

  private extractData(res: Response) {
    const results = res.json();
    return results || [];
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error.status === 403) {
      errMsg = 'Not Authorized. Login to see Results';
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
