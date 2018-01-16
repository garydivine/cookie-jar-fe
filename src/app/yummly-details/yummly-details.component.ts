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
  recipe: object;
  yummlyRecipe: object;
  ingredientQueue: Array<object> = [];

  successMessage: string;
  errorMessage: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService) { }

  saveYummlyRecipeToCookieJar(){
    //need to add {{data.yummlyRecipeDetails.name}} to name
    //{{data.yummlyRecipeDetails.numberOfServings}} to yield
    // { { ingredient } } to ingredientQueue[]
    // api link to instructions?
    //totalTimeInSeconds/60 = time
    //
    console.log(this.data.yummlyRecipeDetails.value);
    
    this.dataService.addRecord("recipes", this.data.yummlyRecipeDetails.value)
      .subscribe(
      recipe => {
       
        this.successMessage = "Recipe added to Cookie.Jar";
        this.recipe = recipe;
      
        // this.recipe = {};
      },
      error => this.errorMessage = <any>error);
  }

  // if ingredient doesn't exist in table, do we need to add

  // saveIngredientItemToRecipe(ingredientRecipe, yummlyRecipe: ) {
  //   this.dataService.addRecord("ingredientToRecipe/" + this.recipe["id"], ingredientRecipe)
  //     .subscribe(
  //     recipe => {},
  //     error => this.errorMessage = <any>error);
  //   }

    addToIngredientQueue(ingredientRecipe) {
      this.ingredientQueue.push(ingredientRecipe);

    }


    formErrors = {};
    validationMessages = {};

  
  ngOnInit() {
    this.saveYummlyRecipeToCookieJar();
    
  }


}
