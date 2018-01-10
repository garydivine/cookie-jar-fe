import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataService } from '../data.service'
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component'
import { fadeInAnimation } from '../animations/fade-in.animation';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  errorMessage: string;
  successMessage: string;
  recipes: any[];

  constructor(private dataService: DataService, public dialog: MatDialog) { }

  getRecipes() {
    this.dataService.getRecords("recipes")
      .subscribe(
        recipes => this.recipes = recipes,
        error =>  this.errorMessage = <any>error);
  }

  deleteRecipe(id:number) {

    let dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.dataService.deleteRecord("recipes", id)
          .subscribe(
            recipes => {
              this.successMessage = "Record(s) deleted successfully"; 
              this.getRecipes(); 
            },
            error =>  this.errorMessage = <any>error);
      }
    });
  }

  ngOnInit() { 
    this.getRecipes(); 
  }

}