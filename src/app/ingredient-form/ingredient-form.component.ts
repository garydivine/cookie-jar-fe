import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { NgForm} from '@angular/forms';
import { DataService } from '../data.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { IngredientDialogFormComponent } from '../ingredient-dialog-form/ingredient-dialog-form.component';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.css'],
  animations: [fadeInAnimation]
})
export class IngredientFormComponent implements OnInit {

  ingredientForm: NgForm;
  @ViewChild('ingredientForm')
  currentForm: NgForm;

  successMessage: string;
  errorMessage: string;

  ingredientRecipe: object;

  ingredients;

  @Output() ingredientRecipeSubmitted = new EventEmitter();

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getIngredients();
  }

  getIngredients(){
    this.dataService.getRecords("ingredients")
    .subscribe(
    ingredients => {
      ingredients.sort(function (a, b) {
        var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
        if (nameA < nameB) //sort string ascending
          return -1
        if (nameA > nameB)
          return 1
        return 0 //default return value (no sorting)
      });

      this.ingredients = ingredients;

    }
  );
  }

  saveIngredientToTable(ingredientForm: NgForm) {
      this.dataService.addRecord('ingredientRecipeListItem', ingredientForm.value)
        .subscribe(
          result => {
            this.successMessage = 'Ingredient added to your list';
            this.ingredientForm = ingredientForm;
            this.ingredientRecipeSubmitted.emit(result);
          },
          error => this.errorMessage = <any>error
        );
          this.ingredientForm.form.reset();
    }

    invokeIngredientDialog() {
      const dialogRef = this.dialog.open(IngredientDialogFormComponent);
      const sub = dialogRef.componentInstance.ingredientSubmitted.subscribe((ingredient) => {
        this.getIngredients();
      });
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewChecked() {
      this.formChanged();
    }

  formChanged() {
    this.ingredientForm = this.currentForm;
    this.ingredientForm.valueChanges
      .subscribe(
      data => this.onValueChanged()
      );
  }

  onValueChanged() {
    const form = this.ingredientForm.form;

    // tslint:disable-next-line:forin
    for (const field in this.formErrors) {
      // clear previous error message (if any)
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
      'ingredient': '',
      'quantity': '',
      'unitOfMeasurement': '',
    };

    // tslint:disable-next-line:member-ordering
    validationMessages = {
      'ingredient': {
        'required': 'Ingredient is required',
        'maxlength': 'Ingredient name must be less than 50 characters'
      },
      'quantity': {
        'required': 'Ingredient quantity is needed',
        'maxlength': 'Ingredient quantity must be less than 30 characters'
     },
     'unitOfMeasurement': {}
  };

}
