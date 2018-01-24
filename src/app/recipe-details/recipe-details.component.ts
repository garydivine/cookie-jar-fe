import { Component, OnInit, Input, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {

  instructions: string;

  linkForEmail: string = `mailto:test@example.com&subject=${this.data.recipeDetails.name}&body=Bake at ${this.data.recipeDetails.temp} for ${ this.data.recipeDetails.time}.
%0D
%0D
Instructions:
%0D
${this.data.recipeDetails.instructions}
%0D
%0D
Yield:
%0D
${this.data.recipeDetails.yield}
%0D
%0D
Ingredients:
%0D
`


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  openUserMailClient() {
    for (let ingredientItem of this.data.recipeDetails.ingredientRecipeListItem) {
      this.linkForEmail = this.linkForEmail + `${ingredientItem.quantity} ${ingredientItem.unitOfMeasurement} ${ingredientItem.ingredient.name}%0D`
    }



    window.location.href = this.linkForEmail;
  }

}
