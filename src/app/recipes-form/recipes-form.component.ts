import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component';
import { MatDialog, MatDialogRef } from '@angular/material';

import { DataService } from '../data.service';
import { fadeInAnimation } from '../animations/fade-in.animation';

@Component({
  selector: 'app-recipes-form',
  templateUrl: './recipes-form.component.html',
  styleUrls: ['./recipes-form.component.css'],
  animations: [fadeInAnimation]
})
export class RecipesFormComponent implements OnInit {

  recipeForm: NgForm;
  @ViewChild('recipeForm')
  currentForm: NgForm;

  successMessage: string;
  errorMessage: string;

  recipe: object;
  ingredientQueue: Array<object> = [];

  user: any = null;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        // tslint:disable-next-line:no-unused-expression
        (+params['id']) ? this.getRecordForEdit() : null;
      });
  }

  getRecordForEdit() {
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord('recipes', +params['id']))
      .subscribe(recipe => this.recipe = recipe);
  }

  saveRecipe(recipeForm: NgForm) {
    this.getUserFromSession();
    this.recipeForm.value['user'] = this.user;

    // Editing an existing recipe
    if (typeof recipeForm.value.id === 'number') {
      this.dataService.editRecord('recipes', recipeForm.value, recipeForm.value.id)
        .subscribe(
          recipe => {
            this.successMessage = 'Cookie recipe updated successfully';
            this.recipe = recipe;
            for (const ingredientRecipe of this.ingredientQueue) {
              this.saveIngredientItemToRecipe(ingredientRecipe, recipeForm);
            }
            // Needed for deleting ingredients off of a recipe
            // The recipe returned isn't up-to-date
            this.getRecordForEdit();
            this.ingredientQueue = [];
          },
          error => this.errorMessage = <any>error
        );
    } else {
      // Creating a new recipe
      this.dataService.addRecord('recipes', recipeForm.value)
        .subscribe(
          recipe => {
            this.successMessage = 'Cookie added to your Cookie.jar!';
            this.recipe = recipe;
            for (const ingredientRecipe of this.ingredientQueue) {
              this.saveIngredientItemToRecipe(ingredientRecipe, recipeForm);
            }
            this.ingredientQueue = [];
            this.recipeForm.form.reset();
            this.recipe = {};
          },
          error => this.errorMessage = <any>error
      );
    }
  }

  saveIngredientItemToRecipe(ingredientRecipe, recipeForm: NgForm) {
    this.dataService.addRecord('ingredientToRecipe/' + this.recipe['id'], ingredientRecipe)
      .subscribe(
        recipe => {
          // Refresh edited recipe
          if (typeof recipeForm.value.id === 'number') {
            this.getRecordForEdit();
          }
        },
        error => this.errorMessage = <any>error
      );
  }

  addToIngredientQueue(ingredientRecipe) {
    this.ingredientQueue.push(ingredientRecipe);
  }

  deleteIngredientItem(id: number) {
    const dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.dataService.deleteRecord('ingredientToRecipe', id)
            .subscribe(
            deletedIngredientRecipe => {
              let foundInIngredientQueue = false;

              // If present, remove deleted item from ingredientQueue
              for (const ingredientItem of this.ingredientQueue) {
                if (ingredientItem['id'] === deletedIngredientRecipe['id']) {
                  foundInIngredientQueue = true;
                  const index = this.ingredientQueue.indexOf(ingredientItem);
                  if (index > -1) {
                    this.ingredientQueue.splice(index, 1);
                  }
                }
              }

              // If deleted item not in ingredientQueue, refresh the recipe
              if (!foundInIngredientQueue) {
                this.getRecordForEdit();
              }
            },
            error => this.errorMessage = <any>error);
        }
      }
    );
  }

  getUserFromSession() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.recipeForm = this.currentForm;
    this.recipeForm.valueChanges
      .subscribe(
        data => this.onValueChanged()
      );
  }

  onValueChanged() {
    const form = this.recipeForm.form;

    // tslint:disable-next-line:forin
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  // tslint:disable-next-line:member-ordering
  formErrors = {
    'name': '',
    'instructions': ''
  };

  // tslint:disable-next-line:member-ordering
  validationMessages = {
    'name': {
      'required': 'Recipe name is required',
      'maxlength': 'Recipe name must be less than 60 characters'
    },
    'instructions': {
      'required': 'Recipe instructions are required'
    }
  };

}
