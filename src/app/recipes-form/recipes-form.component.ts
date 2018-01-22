import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component';
import { MatDialog, MatDialogRef } from '@angular/material';

import { DataService } from '../data.service';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { getDefaultService } from 'selenium-webdriver/edge';

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
  ) {}

  getRecordForEdit() {
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord('recipes', +params['id']))
      .subscribe(recipe => this.recipe = recipe);
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        // tslint:disable-next-line:no-unused-expression
        (+params['id']) ? this.getRecordForEdit() : null;
      });
  }

  saveRecipe(recipeForm: NgForm) {

    this.getUserFromSession();
    this.recipeForm.value['user'] = this.user;

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
    }else {
      this.dataService.addRecord('recipes', recipeForm.value)
          .subscribe(
            recipe => {
              this.successMessage = 'Cookie added to your Cookie.Jar!';
              this.recipe = recipe;
              for (const ingredientRecipe of this.ingredientQueue) {
                this.saveIngredientItemToRecipe(ingredientRecipe, recipeForm);
              }
              this.ingredientQueue = [];
              this.recipeForm.form.reset();
              this.recipe = {};
          },
            error =>  this.errorMessage = <any>error);
    }

  }

  saveIngredientItemToRecipe(ingredientRecipe, recipeForm: NgForm) {
    this.dataService.addRecord('ingredientToRecipe/' + this.recipe['id'], ingredientRecipe)
          .subscribe(
            recipe => {
              if (typeof recipeForm.value.id === 'number') {
              this.getRecordForEdit();
              }
            }
            ,
            error =>  this.errorMessage = <any>error);
  }


  addToIngredientQueue(ingredientRecipe) {
    this.ingredientQueue.push(ingredientRecipe);

  }

  deleteIngredientItem(id: number) {
    const dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteRecord('ingredientToRecipe', id)
          .subscribe(
            deletedIngredientRecipe => {
            let foundInIngredientQueue: boolean = false;

            // If present, remove deleted item from ingredientQueue
            for (let ingredientItem of this.ingredientQueue){
              if (ingredientItem["id"] === deletedIngredientRecipe["id"]) {
                foundInIngredientQueue = true;
                let index = this.ingredientQueue.indexOf(ingredientItem);
                  if (index > -1){
                    this.ingredientQueue.splice(index, 1);
                  }
              }
            } 

            // If deleted item not in ingredientQueue, refresh the recipe
            if (!foundInIngredientQueue){
              this.getRecordForEdit();
            }
           },
          error => this.errorMessage = <any>error);
          }
        });
  }

  getUserFromSession() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

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
    let form = this.recipeForm.form;

    for (let field in this.formErrors) {
      
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'name': '',
    'instructions': ''
  };

  validationMessages = {
    'name': {
      'required': 'Recipe name is required',
      'maxlength' : 'Recipe name must be less than 60 characters'
    },
    
    'instructions': {
      'required': 'Recipe instructions are required'
     
    }

  };

}
