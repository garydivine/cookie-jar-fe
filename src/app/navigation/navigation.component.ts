import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { LogoutComponent } from '../logout/logout.component';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

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

  invokeLogoutDialog() {
    const dialogRef = this.dialog.open(LogoutComponent);
  }

  ngOnInit() {
  }

}
