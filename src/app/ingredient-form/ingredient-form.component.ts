import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { NgForm} from '@angular/forms';
import { DataService } from '../data.service';
import { ActivatedRoute, Params } from '@angular/router';


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

  ingredient: object;


  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  getRecordsForEdit() {
    this.route.params
    .switchMap((params: Params) => this.dataService.getRecord("ingredients", +params['id']))
    .subscribe(ingredient => this.ingredient = ingredient);
  }

  ngOnInit() {
    this.route.params
    .subscribe((params: Params) => {
      (+params['id']) ?this.getRecordsForEdit() : null;
    });
  }

  saveIngredient(ingredientForm: NgForm) {
    if(typeof ingredientForm.value.id === "number") {
      this.dataService.editRecord("ingredient",ingredientForm.value, ingredientForm.value.id)
      .subscribe(
        ingredient => this.successMessage = "Record updated",
        error => this.errorMessage = <any>error);
      }



    }
  }

}
