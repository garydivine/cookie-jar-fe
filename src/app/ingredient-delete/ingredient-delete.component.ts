import { Component, OnInit } from '@angular/core';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { DataService } from '../data.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component';
import { IngredientFormComponent } from '../ingredient-form/ingredient-form.component';

@Component({
  selector: 'app-ingredient-delete',
  templateUrl: './ingredient-delete.component.html',
  styleUrls: ['./ingredient-delete.component.css'],
  animations: [fadeInAnimation]
})
export class IngredientDeleteComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  ingredients: any[];
  next: boolean;
  previous: boolean;

  constructor(private dataService: DataService, public dialog: MatDialog) { }

  // get a list of all ingredients
  getIngredients() {
    this.next = true;
    this.previous = false;

    this.dataService.getRecords('ingredients')
    .subscribe(
  
      ingredients => this.ingredients = ingredients.reverse().splice(0, 24),
      error => this.errorMessage = <any>error,
    );
  }

  getNextSetOfIngredients() {
    this.next = false;
    this.previous = true;

    this.dataService.getRecords('ingredients')
    .subscribe(
      ingredients =>this.ingredients = ingredients.reverse().splice(25, 50),
      error => this.errorMessage = <any>error,
    );
  }

  deleteIngredient(id: number) {

    const dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteRecord('ingredients', id)
          .subscribe(
          ingredients => {
            this.successMessage = 'Ingredient has been deleted';
            this.getIngredients();
          },
          error => this.errorMessage = 'This ingredient can not be deleted because it is being used in a recipe');
      }
    });
   }

 

  ngOnInit() {
    this.getIngredients();
  }
  

}
