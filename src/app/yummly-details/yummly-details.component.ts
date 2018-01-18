import { Component, OnInit, Input, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import { DataService } from '../data.service';
import { MatDialog, MatDialogRef } from '@angular/material';

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

  existingIngredients;

  ingredientsThatErrored = [];



  ingredientPattern = /^((?:[\d\xBC-\xBE\u2151-\u215e]+)|(?:\d+\/\d+)|(?:\d+ \d+\/\d+)|(?:\d+ [\d\xBC-\xBE\u2151-\u215e]+?)) ((?:tbsp|tbs|tsp|cup|tablespoon|teaspoon|pinch|cup|ounce|oz|stick)(?:s|es)?\.?)?\b(.+)/i

  successMessage: string;
  errorMessage: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService, public dialogRef: MatDialogRef<YummlyDetailsComponent>) { }

  getExistingIngredients() {
    this.dataService.getRecords("ingredients")
    .subscribe(
    ingredients => {
      this.existingIngredients = ingredients;
    }
  );
  }

  saveYummlyRecipeToCookieJar(){
    this.recipe = {
      name:         this.data.yummlyRecipeDetails.name,
      instructions: this.data.yummlyRecipeDetails.source.sourceRecipeUrl,
      temp:         "See Instructions",
      yield:        this.data.yummlyRecipeDetails.numberOfServings,
      time:         this.data.yummlyRecipeDetails.totalTime
    };

    this.dataService.addRecord("recipes", this.recipe)
      .subscribe(
        recipe => {
          this.successMessage = "Recipe added to My Cookie.Jar";
          this.recipe = recipe;
          // Adding Ingredient Line Items to Recipe that was just created
          for (let ingredientLine of this.data.yummlyRecipeDetails.ingredientLines) {
            let ingredientRecipe: object = {
              unitOfMeasurement: "",
              quantity: "",
              ingredient: {}
            };

            let quantity = this.findProperties(ingredientLine)["quantity"];
            if (quantity != null) {
              //quantity = quantity.trim();
              quantity = quantity.replace(/(^[,.\s]+)|([,.\s]+$)/g, '');
            }
            console.log(quantity);
            ingredientRecipe["quantity"] = quantity;

            let unitOfMeasurement = this.findProperties(ingredientLine)["measurement"];
            if (unitOfMeasurement != null) {
              //unitOfMeasurement = unitOfMeasurement.trim();
              unitOfMeasurement = unitOfMeasurement.replace(/(^[,.\s]+)|([,.\s]+$)/g, '');
            }
            console.log(unitOfMeasurement);

            ingredientRecipe["unitOfMeasurement"] = unitOfMeasurement

            let ingredientStringFromApi: string = this.findProperties(ingredientLine)["ingredientName"];
            if (ingredientStringFromApi != null) {
              //ingredientStringFromApi = ingredientStringFromApi.trim();
              ingredientStringFromApi = ingredientStringFromApi.replace(/(^[,.\s]+)|([,.\s]+$)/g, '');
            }

            if(ingredientStringFromApi == null){
              this.ingredientsThatErrored.push(ingredientLine);
            } else {
              this.saveIngredient(ingredientStringFromApi, ingredientRecipe);
            }
          }
          this.dialogRef.close()
        },
        error => this.errorMessage = <any>error
      );
  }

  saveIngredient(ingredientStringFromApi: string, ingredientRecipe: object) {
    //console.log(ingredientRecipe)
    //console.log(this.recipe["id"])
    let ingredientToAdd = {
      name: ""
    }

    let wasFound: boolean = false;
    let foundIngredient;

    for (let existingIngredient of this.existingIngredients){
      if(existingIngredient.name.toUpperCase() === ingredientStringFromApi.toUpperCase()){
        wasFound = true;
        foundIngredient = existingIngredient;
      }
    }

    if(wasFound) {
      ingredientRecipe["ingredient"] = foundIngredient;
      this.addIngredientLineItemToRecipe(ingredientRecipe);
    }
    

    if(!wasFound) {
      ingredientToAdd.name = ingredientStringFromApi;
      this.dataService.addRecord("ingredients", ingredientToAdd)
      .subscribe(
        ingredient => {
          ingredientRecipe["ingredient"] = ingredient;
          this.addIngredientLineItemToRecipe(ingredientRecipe);
        },
        error => {
        }
      );
    }
  }

  addIngredientLineItemToRecipe(ingredientRecipe: object){
    this.dataService.addRecord("ingredientToRecipe/" + this.recipe["id"], ingredientRecipe)
        .subscribe(
          recipe => {console.log(this.ingredientsThatErrored)},
          error => this.errorMessage = <any>error
        );

    }

  findProperties(ingredientString: string): object {
    let matches = ingredientString.match(this.ingredientPattern)

    console.log(`On ${ingredientString}, we matched: `, matches)
    if (matches == null) {
      // do error handling
      matches = [null, null, null]
    }
    
    return ({
      quantity:    matches[1] || null,
      measurement: matches[2] || null,
      ingredientName:  matches[3]
    })
  }
 
  formErrors = {};
  validationMessages = {};

  ngOnInit() {
    this.getExistingIngredients();
  }


}
