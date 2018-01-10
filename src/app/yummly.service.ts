import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class YummlyService {

  private baseUrl: string = 'http://api.yummly.com/v1/api/recipes?_app_id=37304cb5&_app_key=9a0515dab83f075f9bd1365932fcc264&q=cookies';

  constructor(private http: Http) { }

  getRecipes(): Observable<any> {

    return this.http.get(this.baseUrl)
      .map(result => {
        return result.json();
      });

  }

}
