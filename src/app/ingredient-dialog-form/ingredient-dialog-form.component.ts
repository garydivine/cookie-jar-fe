import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm} from '@angular/forms';
import { DataService } from '../data.service';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-ingredient-dialog-form',
  templateUrl: './ingredient-dialog-form.component.html',
  styleUrls: ['./ingredient-dialog-form.component.css']
})
export class IngredientDialogFormComponent implements OnInit {

  pantryForm: NgForm;
  @ViewChild('pantryForm')
  currentForm: NgForm;

  successMessage: string;
  errorMessage: string;

  ingredient: object;

  @Output() ingredientSubmitted = new EventEmitter();


  constructor(
    private dataService: DataService,
    public dialogRef: MatDialogRef<IngredientDialogFormComponent>
  ) { }

  ngOnInit() {
  }

  saveIngredient(pantryForm: NgForm) {
      this.dataService.addRecord("ingredients", pantryForm.value)
        .subscribe(
          ingredient => {
            this.successMessage = "Record added";
            this.ingredient = ingredient;
            this.ingredientSubmitted.emit(ingredient);
          },
          error => this.errorMessage = "This ingredient already exists"
        );
        this.ingredient = {};
    }

    ngAfterViewChecked() {
      this.formChanged();

    }

    formChanged() {
      this.pantryForm = this.currentForm;
      this.pantryForm.valueChanges
      .subscribe(
        data => this.onValueChanged()
      );
    }

    onValueChanged() {
      let form = this.pantryForm.form;

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
     'ingredient' : ''
    };

    validationMessages = {
      'ingredient': {
        'required': 'Ingredient is required',
       
      }
    }

  

}
