import { Component, OnInit, Input } from '@angular/core';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { DataService } from '../data.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component'
@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.css'],
  animations: [fadeInAnimation]
})

export class IngredientComponent implements OnInit {
  errorMessage: string;
  successMessage: string;
  ingredients: any[];

  constructor(private dataService: DataService, public dialog: MatDialog) { }
  
  getIngredients() {
    this.dataService.getRecords("ingredients").subscribe(
      ingredients => this.ingredients = ingredients,
      error => this.errorMessage = <any>error);
  }

  deleteIngredient(id:number) {
    let dialogRef = this.dialog.open(DeleteConfirmComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result){this.dataService.deleteRecord("ingredients", id)
      .subscribe( ingredients => {
        this.successMessage = "Record(s) deleted" ;
        this.getIngredients();
        },
      error => this.errorMessage = <any>error);
      }
    });
  }

  ngOnInit() {
    this.getIngredients();
  }

}
