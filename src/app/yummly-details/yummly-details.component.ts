import { Component, OnInit, Input, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import { DataService } from '../data.service';

@Component({
  selector: 'app-yummly-details',
  templateUrl: './yummly-details.component.html',
  styleUrls: ['./yummly-details.component.css']
})
export class YummlyDetailsComponent implements OnInit {

  recipe: object = {
    "name": "",
    "instructions": "",
    "temp": "",
    "yield": "",
    "time": "",
  };
 
  ingredientQueue: Array<object> = [];
  ingredient: string;
  ingredientRecipe: object = {
    // "unitOfMeasurement": "",
    "quantity": "",
    // "ingredient": "",
  }
    ;

  successMessage: string;
  errorMessage: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService) { }

  saveYummlyRecipeToCookieJar(){

    this.recipe["name"] = this.data.yummlyRecipeDetails["name"];
    this.recipe["instructions"] = this.data.yummlyRecipeDetails["source"]["sourceRecipeUrl"];
    this.recipe["temp"] = "See Instructions";
    this.recipe["yield"] =this.data.yummlyRecipeDetails["numberOfServings"];
    this.recipe["time"] = this.data.yummlyRecipeDetails["totalTime"];

    this.dataService.addRecord("recipes", this.recipe)
      .subscribe(
      recipe => {
        this.successMessage = "Recipe added to My Cookie.Jar";
        this.recipe = recipe;
        let index = 0;
        for (let ingredient of this.data.yummlyRecipeDetails.ingredientLines) {
          this.ingredientRecipe["quantity"] = this.data.yummlyRecipeDetails.ingredientLines[index]
          this.saveIngredientItemToRecipe(this.ingredientRecipe, this.recipe);
          index = index + 1;
        }
        error => this.errorMessage = <any>error
      });
  }

  saveIngredientItemToRecipe(ingredientRecipe, recipe) {
    console.log(ingredientRecipe)
    console.log(this.recipe["id"])
    this.dataService.addRecord("ingredientToRecipe/" + this.recipe["id"], this.ingredientRecipe)
      .subscribe(
      recipe => { }
      ,
      error => this.errorMessage = <any>error);
  }

 
    formErrors = {};
    validationMessages = {};

  
  ngOnInit() {
    
    
  }


}
