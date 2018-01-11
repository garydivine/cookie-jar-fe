import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { NgForm} from '@angular/forms';
import { DataService } from '../data.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

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
    private location: Location
  ) { }

  ngOnInit() {
    this.dataService.getRecords("ingredients")
    .subscribe(
      ingredients => this.ingredients = ingredients
    );
  }

  saveIngredientToTable(ingredientForm: NgForm) {
      this.dataService.addRecord("ingredientRecipeListItem", ingredientForm.value)
        .subscribe(
          result => 
          this.ingredientRecipeSubmitted.emit(result),
          error => this.errorMessage = <any>error
        );
          this.ingredientForm.form.reset();

    }


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
      let form = this.ingredientForm.form;

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
    };

    validationMessages = {
    }
  }


