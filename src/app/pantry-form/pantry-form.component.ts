import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { NgForm} from '@angular/forms';
import { DataService } from '../data.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pantry-form',
  templateUrl: './pantry-form.component.html',
  styleUrls: ['./pantry-form.component.css'],
  animations: [fadeInAnimation]
})
export class PantryFormComponent implements OnInit {

  pantryForm: NgForm;
  @ViewChild('pantryForm')
  currentForm: NgForm;

  successMessage: string;
  errorMessage: string;

  ingredient: object;


  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  getRecordsForEdit() {
    this.route.params
    .switchMap((params: Params) => this.dataService.getRecord('ingredients', +params['id']))
    .subscribe(ingredient => this.ingredient = ingredient);
  }

  ngOnInit() {
    this.route.params
    .subscribe((params: Params) => {
      (+params['id']) ?this.getRecordsForEdit() : null;
    });
  }

  saveIngredient(pantryForm: NgForm) {
    if (typeof pantryForm.value.id === 'number') {
      this.dataService.editRecord('ingredients', pantryForm.value, pantryForm.value.id)
      .subscribe(
        ingredient => this.successMessage = 'Ingredient updated',
        error => this.errorMessage = <any>error
      );
      }else{
      this.dataService.addRecord('ingredients', pantryForm.value)
        .subscribe(
          result => this.successMessage = 'Ingredient added',
          error => this.errorMessage = 'This ingredient already exists'
        );
        this.ingredient = {};
      }
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
      const form = this.pantryForm.form;

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
     // 'ingredient' : ''
    };

    validationMessages = {
      'ingredient': {
        'required': 'Ingredient is required',
       
      }
    }
  }


