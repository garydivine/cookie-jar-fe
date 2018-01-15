import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class YummlyService {

  // tslint:disable-next-line:no-inferrable-types
  private recipeUrl: string = 'https://api.yummly.com/v1/api/recipe/';
  // tslint:disable-next-line:no-inferrable-types
  private recipesUrl: string = 'https://api.yummly.com/v1/api/recipes';
  // tslint:disable-next-line:no-inferrable-types
  private apiSpec: string = '?_app_id=37304cb5&_app_key=9a0515dab83f075f9bd1365932fcc264';
  // tslint:disable-next-line:no-inferrable-types
  private cookieQuery: string = '&q=cookies&maxResult=10&start=';

  randomNumber: number;

  constructor(private http: Http) { }

  // Generate a Random Number between 1 and 80,000
  // 80,00 is around the total number of recipes on Yummly for cookies as of Jan, 2018
  // This is used to generate the "start=" position (needed at the end of cookieQuery) in the API URL
  // Documentaton for filtering on starting position is in the Yummly API Docs under the bullet "maxResult, start"
  // https://developer.yummly.com/documentation
  generateRandomNumber() {
    this.randomNumber = Math.floor(Math.random() * (80000 - 0) + 1);
  }

  // Get a random list of 10 Cookie Recipes out of 80,000
  getRecipes(): Observable<any> {
    this.generateRandomNumber();
    const apiUrl = `${this.recipesUrl}${this.apiSpec}${this.cookieQuery}${this.randomNumber}`;
    return this.http.get(apiUrl)
      .map(result => {
        return result.json();
      });
  }

  // Get details on a specific Cookie recipe based on a passed in ID
  getRecipe(id: String): Observable<any> {
    const apiUrl = `${this.recipeUrl}${id}${this.apiSpec}`;
    return this.http.get(apiUrl)
      .map(result => {
        return result.json();
      });
  }

  // Search for recipes based on a passed query parameter
  searchForRecipes(endpoint: string): Observable<any> {
    const apiUrl = `${this.recipesUrl}${this.apiSpec}&q=${endpoint}`;
    return this.http.get(apiUrl)
    .map(result => {
      return result.json();
    });
  }

}
