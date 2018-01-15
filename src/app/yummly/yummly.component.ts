import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { YummlyService } from '../yummly.service';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { YummlyDetailsComponent } from '../yummly-details/yummly-details.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-yummly',
  templateUrl: './yummly.component.html',
  styleUrls: ['./yummly.component.css'],
  animations: [fadeInAnimation]
})
export class YummlyComponent implements OnInit {

  yummlyRecipes: any[];
  yummlyRecipeDetails: any[];
  errorMessage: string;
  query: NgForm;

  @Output() querySubmitted = new EventEmitter();

  constructor(private yummlyService: YummlyService, public dialog: MatDialog) { }

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
      yummlyRecipeDetails => {
        this.yummlyRecipeDetails = yummlyRecipeDetails;
        const dialogRef = this.dialog.open(YummlyDetailsComponent, {
          data: { yummlyRecipeDetails: this.yummlyRecipeDetails },
        });
        dialogRef.afterOpen().subscribe();
      },
      error => this.errorMessage = <any>error
      );
  }

  // Get recipe details based on a searched query
  // Builds a query parameter in yummly.service.ts based on submitted NgForm
  // Stores in the yummlyRecipes variable to immediately update page with results
  getRecipesFromYummlyBasedOnQuery(query: NgForm) {
    this.yummlyService.searchForRecipes(query.value.replace(/\s/g, ''))
      .subscribe(
      yummlyRecipes => this.yummlyRecipes = yummlyRecipes.matches,
    );
  }

  // Load a random list of Cookie Recipes when the Yummly page loads
  ngOnInit() {
    this.getRecipeFromYummly();
  }

}
