import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { YummlyService } from '../yummly.service';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { YummlyDetailsComponent } from '../yummly-details/yummly-details.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-yummly',
  templateUrl: './yummly.component.html',
  styleUrls: ['./yummly.component.css'],
  animations: [fadeInAnimation]
})
export class YummlyComponent implements OnInit {

  yummlyRecipes: any[];
  yummlyRecipeDetails: any[];

  successMessage: string;
  errorMessage: string;

  @Output() querySubmitted = new EventEmitter();

  displayedColumns = ['name', 'prep time', 'rating', 'picture', 'view details'];
  dataSource = new MatTableDataSource(this.yummlyRecipes);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private yummlyService: YummlyService, public dialog: MatDialog) { }

  // Get a recipe list from Yummly using the built Yummly Service
  // contained in yummly.service.ts
  // Store in the variable yummlyRecipes
  getRecipeFromYummly() {
    // Setting messages back to null if they have anything in them
    this.successMessage = null;
    this.errorMessage = null;

    this.yummlyService.getRecipes()
      .subscribe(
      yummlyRecipes => {
        this.yummlyRecipes = yummlyRecipes.matches;
        let tempRecipes = [];
        for (const recipe of this.yummlyRecipes) {
          let stringifiedRecipe = JSON.stringify(recipe);
          stringifiedRecipe = stringifiedRecipe.replace(/(http)[^s]/g, 'https:');
          let newRecipe = JSON.parse(stringifiedRecipe);
          tempRecipes.push(newRecipe);
        }

        this.yummlyRecipes = tempRecipes;

        this.dataSource.data = this.yummlyRecipes;
      },
      error => this.errorMessage = <any>error
    );
  }

  // Get recipe details for a passed ID using the built Yummly Service
  // contained in yummly.service.ts
  // Store in the variable yummlyRecipeDetails
  getRecipeDetailsFromYummly(id) {
    // Setting messages back to null if they have anything in them
    this.successMessage = null;
    this.errorMessage = null;

    this.yummlyService.getRecipe(id)
      .subscribe(
      yummlyRecipeDetails => {
        this.yummlyRecipeDetails = yummlyRecipeDetails;
        const dialogRef = this.dialog.open(YummlyDetailsComponent, {
          data: { yummlyRecipeDetails: this.yummlyRecipeDetails },
        });
        dialogRef.afterClosed().subscribe(message => {
          // Ensuring message is other than true
          // Message is true if the dialog is closed without user adding cookie to cookie jar
          if (message != true) {
            this.successMessage = message;
          }
                  }
        );
      },
      error => this.errorMessage = <any>error
      );
  }

  // Get recipe details based on a searched query
  // Builds a query parameter in yummly.service.ts based on user input
  // Stores in the yummlyRecipes variable to immediately update page with results
  getRecipesFromYummlyBasedOnQuery(query: string) {
    // Setting messages back to null if they have anything in them
    this.successMessage = null;
    this.errorMessage = null;
    this.yummlyService.searchForRecipes(query.split(' '))
      .subscribe(
      yummlyRecipes => {
        this.yummlyRecipes = yummlyRecipes.matches;
        this.dataSource.data = yummlyRecipes.matches;
      }
    );
  }

  // Load a random list of Cookie Recipes when the Yummly page loads
  ngOnInit() {
    this.getRecipeFromYummly();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
