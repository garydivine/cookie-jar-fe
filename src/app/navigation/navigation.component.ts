import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  invokeLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent);
  }

  ngOnInit() {
  }

}
