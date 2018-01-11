import { Component, OnInit } from '@angular/core';
import { YummlyService } from '../yummly.service';
import { fadeInAnimation } from '../animations/fade-in.animation';

@Component({
  selector: 'app-yummly',
  templateUrl: './yummly.component.html',
  styleUrls: ['./yummly.component.css'],
  animations: [fadeInAnimation]
})
export class YummlyComponent implements OnInit {

  yummlyRecipes: any[];
  yummlyRecipeDetails: any[];

  constructor(private yummlyService: YummlyService) { }

  // Get a recipe list from Yummly using the built Yummly Service
  // contained in yummly.service.ts
  // Store in the variable yummlyRecipes
  getRecipeFromYummly() {
    this.yummlyService.getRecipes()
      .subscribe(
      yummlyRecipes => this.yummlyRecipes = yummlyRecipes.matches,
    );
  }

  // Get recipe details for a passed ID using the built Yummly Service
  // contained in yummly.service.ts
  // Store in the variable yummlyRecipeDetails
  getRecipeDetailsFromYummly(id) {
    this.yummlyService.getRecipe(id)
      .subscribe(
      yummlyRecipeDetails => this.yummlyRecipeDetails = yummlyRecipeDetails,
    );
  }

  // Load a random list of Cookie Recipes when the Yummly page loads
  ngOnInit() {
    this.getRecipeFromYummly();
  }

}
