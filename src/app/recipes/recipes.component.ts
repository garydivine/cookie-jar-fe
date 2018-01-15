import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataService } from '../data.service';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component';
import { RecipeDetailsComponent } from '../recipe-details/recipe-details.component';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  animations: [fadeInAnimation]
})
export class RecipesComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  recipes: any[];
  recipeDetails;
  next: boolean;
  previous: boolean;
  query: NgForm;

  constructor(private dataService: DataService, public dialog: MatDialog) { }

  getRecipes() {
    this.next = true;
    this.previous = false;

    this.dataService.getRecords('recipes')
      .subscribe(
      recipes => this.recipes = recipes.reverse().splice(0, 10),
      error => this.errorMessage = <any>error,
    );
  }

  getNextSetOfRecipes() {
    this.next = false;
    this.previous = true;

    this.dataService.getRecords('recipes')
      .subscribe(
      recipes => this.recipes = recipes.reverse().splice(10, 20),
      error => this.errorMessage = <any>error
      );
  }

  getRecipeDetails(id: number) {
    this.dataService.getRecord('recipes', id)
      .subscribe(
      recipeDetails => {
        this.recipeDetails = recipeDetails;
        const dialogRef = this.dialog.open(RecipeDetailsComponent, {
          data: { recipeDetails: this.recipeDetails },
        });
        dialogRef.afterOpen().subscribe();
      },
      error => this.errorMessage = <any>error
      );
  }

  getRecipesBasedOnQuery(query: NgForm) {
    this.dataService.searchForRecipes(query.value.replace(/\s/g, ''))
      .subscribe(
        recipes => this.recipes = recipes.reverse(),
    );
  }

  deleteRecipe(id: number) {

    const dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteRecord('recipes', id)
          .subscribe(
          recipes => {
            this.successMessage = 'Record(s) deleted successfully';
            this.getRecipes();
          },
          error => this.errorMessage = <any>error);
      }
    });
  }

  ngOnInit() {
    this.getRecipes();
  }

}
