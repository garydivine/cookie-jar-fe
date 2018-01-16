import { Component, OnInit, Input, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import { DataService } from '../data.service';

@Component({
  selector: 'app-yummly-details',
  templateUrl: './yummly-details.component.html',
  styleUrls: ['./yummly-details.component.css']
})
export class YummlyDetailsComponent implements OnInit {
  name: string;
  yeild: string;
  totalTimeInSeconds: any;
  recipe: object = {
    "name": "",
    "instructions": "",
    "temp": "",
    "yield": "",
    "time": "",
    
    

  };
 
  ingredientQueue: Array<object> = [];

  successMessage: string;
  errorMessage: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService) { }

  saveYummlyRecipeToCookieJar(){

    // { { ingredient } } to ingredientQueue[]
    //
    this.recipe["name"] = this.data.yummlyRecipeDetails["name"];
    this.recipe["instructions"] = this.data.yummlyRecipeDetails["source"]["sourceRecipeUrl"];
    this.recipe["temp"] = "";
    this.recipe["yield"] =this.data.yummlyRecipeDetails["numberOfServings"];
    this.recipe["time"] = this.data.yummlyRecipeDetails["totalTime"];

    console.log(this.recipe);
  

    
    this.dataService.addRecord("recipes", this.recipe)
      .subscribe(
      recipe => {
        this.recipe = recipe,
        error => this.errorMessage = <any>error
      });
  }

    addToIngredientQueue(ingredientRecipe) {
      this.ingredientQueue.push(ingredientRecipe);

    }

    formErrors = {};
    validationMessages = {};

  
  ngOnInit() {
    
    
  }


}
