import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  private baseUrl = 'http://localhost:8080/api/user/';

  constructor(private http: Http) { }

  createUser(endpoint: String, record: any): Observable<any> {
    console.log(record);
    const apiUrl = `${this.baseUrl}${endpoint}`;
    return this.http.post(apiUrl, record)
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
      errMsg = 'Snack Overflow Error! You are not Authorized. Login to see Results.';
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
