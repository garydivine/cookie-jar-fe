import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'
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

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("recipes", +params['id']))
      .subscribe(recipe => this.recipe = recipe);
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        (+params['id']) ? this.getRecordForEdit() : null;
      });
  }

  saveRecipe(recipeForm: NgForm){
    if(typeof recipeForm.value.id === "number"){
      this.dataService.editRecord("recipes", recipeForm.value, recipeForm.value.id)
          .subscribe(
            recipe => { 
              this.successMessage = "Record updated successfully";
              this.recipe = recipe;
              for (let ingredientRecipe of this.ingredientQueue) {
                this.saveIngredientItemToRecipe(ingredientRecipe, recipeForm);
              }
              this.ingredientQueue = [];
              
          },
            error => this.errorMessage = <any>error
          );
    }else{
      this.dataService.addRecord("recipes", recipeForm.value)
          .subscribe(
            recipe => {
              this.successMessage = "Record added successfully";
              this.recipe = recipe;
              for (let ingredientRecipe of this.ingredientQueue) {
                this.saveIngredientItemToRecipe(ingredientRecipe, recipeForm);
              }
              this.ingredientQueue = [];
              this.recipeForm.form.reset();
              this.recipe = {};
          },
            error =>  this.errorMessage = <any>error);
    }

  }

  saveIngredientItemToRecipe(ingredientRecipe, recipeForm: NgForm){
    this.dataService.addRecord("ingredientToRecipe/" + this.recipe["id"], ingredientRecipe)
          .subscribe(
            recipe => {
              // GD Added..also added to method calls..resolves console error on add of new recipe
              if(typeof recipeForm.value.id === "number"){
              this.getRecordForEdit();
              }
            }
            ,
            error =>  this.errorMessage = <any>error);
  }


  addToIngredientQueue(ingredientRecipe) {
    // Need logic here to ensure that the recipe doesnt have same ingredient twice??
    this.ingredientQueue.push(ingredientRecipe);

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

  formErrors = {};

  validationMessages = {};

}
