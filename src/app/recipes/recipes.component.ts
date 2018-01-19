import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DataService } from '../data.service';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component';
import { DeleteCookiesComponent } from '../delete-cookies/delete-cookies.component';
import { RecipeDetailsComponent } from '../recipe-details/recipe-details.component';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  animations: [fadeInAnimation]
})
export class RecipesComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  recipes: any[];
  recipeDetails;
  next: boolean;
  previous: boolean;
  query: NgForm;
  user: any = null;


  displayedColumns = ['name', 'temp', 'time', 'options'];
  dataSource = new MatTableDataSource(this.recipes);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 

  constructor(private dataService: DataService, public dialog: MatDialog) { }

  getRecipes(id: number) {
    this.dataService.getUserRecords('cookies', this.user.id)
      .subscribe(
      recipes => {
        this.recipes = recipes.reverse();
        this.dataSource.data = recipes;
      },
      error => this.errorMessage = <any>error,
    );
  }
  
  getRecipeDetails(id: number) {
    this.dataService.getRecord('recipes', id)
      .subscribe(
      recipeDetails => {
        this.recipeDetails = recipeDetails;
        const dialogRef = this.dialog.open(RecipeDetailsComponent, {
          data: { recipeDetails: this.recipeDetails },
        });
        dialogRef.afterOpen().subscribe();
      },
      error => this.errorMessage = <any>error
      );
  }
  
  deleteRecipe(id: number) {

    const dialogRef = this.dialog.open(DeleteCookiesComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteRecord('recipes', id)
          .subscribe(
          recipes => {
            this.successMessage = 'Recipe removed from your Cookie Jar';
            this.getRecipes(this.user.id);
          },
          error => this.errorMessage = <any>error);
      }
    });
  }

  getUserFromSession() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }
   
  applyFilter(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  this.dataSource.filter = filterValue;

  ngOnInit() {
    this.getUserFromSession();
    this.getRecipes(this.user.id);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



}
