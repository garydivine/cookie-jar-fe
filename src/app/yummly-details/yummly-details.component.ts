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
    name: '',
    instructions: '',
    temp: '',
    yield: '',
    time: '',
  };

  existingIngredients;

  ingredientsThatErrored = [];

  user: any = null;

  ingredientPattern = /^((?:\d+[ -]\d+\/\d+)|(?:\d+ [\d\xBC-\xBE\u2151-\u215e]+?)|(?:\d+[\/-]\d+)|(?:[\d\xBC-\xBE\u2151-\u215e]+))?\s?((?:tbsp|tbs|tsp|cup|tablespoon|teaspoon|pinch|cup|ounce|oz|stick|gram|g|grm|drop|pkg|package|bag|box|c|t)(?:s|es)?\.?)?(.+)/i

  successMessage: string;
  errorMessage: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService,
  public dialogRef: MatDialogRef<YummlyDetailsComponent>) { }

  getExistingIngredients() {
    this.dataService.getRecords('ingredients')
    .subscribe(
    ingredients => {
      this.existingIngredients = ingredients;
    }
  );
  }

  saveYummlyRecipeToCookieJar() {

    this.getUserFromSession();

    this.recipe = {
      name:         this.data.yummlyRecipeDetails.name,
      instructions: this.data.yummlyRecipeDetails.source.sourceRecipeUrl,
      temp:         'See Instructions',
      yield:        this.data.yummlyRecipeDetails.numberOfServings,
      time:         this.data.yummlyRecipeDetails.totalTime,
      user:         this.user
    };

    this.dataService.addRecord('recipes', this.recipe)
      .subscribe(
        recipe => {
          this.successMessage = 'Recipe added to your Cookie Jar';
          this.recipe = recipe;
          // Adding Ingredient Line Items to Recipe that was just created
          for (const ingredientLine of this.data.yummlyRecipeDetails.ingredientLines) {
            let ingredientRecipe: object = {
              unitOfMeasurement: '',
              quantity: '',
              ingredient: {}
            };

            let quantity = this.findProperties(ingredientLine)['quantity'];
            if (quantity != null) {
              // Remove leading and trailing spaces, commas and periods
              quantity = quantity.replace(/(^[,.\s]+)|([,.\s]+$)/g, '');
            }
            ingredientRecipe['quantity'] = quantity;

            let unitOfMeasurement = this.findProperties(ingredientLine)['measurement'];
            if (unitOfMeasurement != null) {
              // Remove leading and trailing spaces, commas and periods
              unitOfMeasurement = unitOfMeasurement.replace(/(^[,.\s]+)|([,.\s]+$)/g, '');
            }
            ingredientRecipe['unitOfMeasurement'] = unitOfMeasurement;

            let ingredientStringFromApi: string = this.findProperties(ingredientLine)['ingredientName'];
            if (ingredientStringFromApi != null) {
              // Remove anyting in leading parentheses
              // Also remove leading and trailing spaces, commas and periods
              ingredientStringFromApi = ingredientStringFromApi.replace(/(^[,.\s]?(\(.+?\)) )|([,.\s]+$)/g, '');

            }

            if (ingredientStringFromApi == null) {
              this.ingredientsThatErrored.push(ingredientLine);
            } else {
              this.saveIngredient(ingredientStringFromApi, ingredientRecipe);
            }
          }
          if (this.ingredientsThatErrored.length > 0) {
            this.successMessage = `${this.successMessage}. However, there was at least one ingredient we were not able to add for you. 
            Please see the instructions section of the ${this.recipe['name']} recipe to see those ingredients and add them to your recipe.`
            this.updateRecipe();
          }

          this.dialogRef.close(this.successMessage);
        },
        error => {
          this.errorMessage = <any>error;
          this.dialogRef.close(this.errorMessage);
        }
      );
  }

  saveIngredient(ingredientStringFromApi: string, ingredientRecipe: object) {
    let ingredientToAdd = {
      name: ''
    };

    let wasFound = false;
    let foundIngredient;

    for (const existingIngredient of this.existingIngredients){
      if (existingIngredient.name.toLowerCase() === ingredientStringFromApi.toLowerCase()) {
        wasFound = true;
        foundIngredient = existingIngredient;
      }
    }

    if (wasFound) {
      ingredientRecipe['ingredient'] = foundIngredient;
      this.addIngredientLineItemToRecipe(ingredientRecipe);
    }

    if (!wasFound) {
      ingredientToAdd.name = ingredientStringFromApi.toLowerCase();
      this.dataService.addRecord('ingredients', ingredientToAdd)
      .subscribe(
        ingredient => {
          ingredientRecipe['ingredient'] = ingredient;
          this.addIngredientLineItemToRecipe(ingredientRecipe);
        },
        error => {
        }
      );
    }
  }

  addIngredientLineItemToRecipe(ingredientRecipe: object) {
    this.dataService.addRecord('ingredientToRecipe/' + this.recipe['id'], ingredientRecipe)
        .subscribe(
          recipe => {
            console.log(this.ingredientsThatErrored);
          },
          error => this.errorMessage = <any>error
        );
    }

    updateRecipe() {
      this.recipe['instructions'] = `${this.recipe['instructions']} Here are the ingredients we were not able to add for you: `

          for (const ingredientError of this.ingredientsThatErrored){
            this.recipe['instructions'] = `${this.recipe['instructions']} ${ingredientError}.`;

          }
      this.dataService.editRecord('recipes', this.recipe, this.recipe['id'])
          .subscribe(
            recipe => {
              this.recipe = recipe;
          },
            error => this.errorMessage = <any>error
          );
    }

  findProperties(ingredientString: string): object {
    let matches = ingredientString.match(this.ingredientPattern);

    console.log(`On ${ingredientString}, we matched: `, matches);
    if (matches == null) {
      // do error handling
      matches = [null, null, null]
    }
    return ({
      quantity:    matches[1] || null,
      measurement: matches[2] || null,
      ingredientName:  matches[3]
    });
  }

  getUserFromSession() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }
  ngOnInit() {
    this.getExistingIngredients();
  }


}
