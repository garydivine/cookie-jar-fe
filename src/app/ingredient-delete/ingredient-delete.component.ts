import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { DataService } from '../data.service';
import { MatDialog, MatDialogRef, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component';
import { IngredientFormComponent } from '../ingredient-form/ingredient-form.component';

@Component({
  selector: 'app-ingredient-delete',
  templateUrl: './ingredient-delete.component.html',
  styleUrls: ['./ingredient-delete.component.css'],
  animations: [fadeInAnimation]
})
export class IngredientDeleteComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  ingredients: any[];
  next: boolean;
  previous: boolean;

  displayedColumns = ['ingredient', 'options'];
  dataSource = new MatTableDataSource(this.ingredients);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dataService: DataService, public dialog: MatDialog) { }

  // get a list of all ingredients
  getIngredients() {
    this.next = true;
    this.previous = false;

    this.dataService.getRecords('ingredients')
    .subscribe(
      ingredients => {
        ingredients.sort(function (a, b) {
          const nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
          if (nameA < nameB) //sort string ascending
            return -1
          if (nameA > nameB)
            return 1
          return 0; //default return value (no sorting)
        });

      // this.ingredients = ingredients.reverse();
      this.ingredients = ingredients;
      this.dataSource.data = this.ingredients;
    },
      error => this.errorMessage = <any>error,
    );
  }

  deleteIngredient(id: number) {
    this.successMessage = '';
    this.errorMessage = '';

    const dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteRecord('ingredients', id)
          .subscribe(
          ingredients => {
            this.successMessage = 'Ingredient has been deleted';
            this.getIngredients();
          },
          error => this.errorMessage = 'This ingredient can not be deleted because it is being used in a recipe');
      }
    });
   }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  ngOnInit() {
    this.getIngredients();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
