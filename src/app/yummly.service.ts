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
  private cookieQuery: string = '&q=cookies&maxResult=20&start=';
  // tslint:disable-next-line:no-inferrable-types
  private randomCookieQuery: string = '&requirePictures=true&q=cookies&maxResult=1&start=';

  randomNumber: number;

  constructor(private http: Http) { }

  // Generate a Random Number between 1 and 40,000
  // This is used to generate the "start=" position (needed at the end of cookieQuery) in the API URL
  // Documentaton for filtering on starting position is in the Yummly API Docs under the bullet "maxResult, start"
  // https://developer.yummly.com/documentation
  generateRandomNumber() {
    this.randomNumber = Math.floor(Math.random() * (50000 - 0) + 1);
  }

  // Get a random list of 20 Cookie Recipes out of 40,000
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

  // Get details from a random recipe
  getFeaturedRecipe() {
    this.generateRandomNumber();
    const apiUrl = `${this.recipesUrl}${this.apiSpec}${this.randomCookieQuery}${this.randomNumber}`;
    return this.http.get(apiUrl)
    .map(result => {
      return result.json();
    });
  }

  // Search for recipes based on a passed query parameters
  searchForRecipes(userInputWords): Observable<any> {
    let endpoint = '';
    // Loop through userInputWords array and add to the end of endpoint
    for (const word of userInputWords) {
      endpoint = `${endpoint}&q=${word}`;
    }
    // Build out the url and tack the word cookies on the end
    const apiUrl = `${this.recipesUrl}${this.apiSpec}${endpoint}&q=cookies&maxResult=20`;
    return this.http.get(apiUrl)
      .map(result => {
        return result.json();
      });
  }

}
