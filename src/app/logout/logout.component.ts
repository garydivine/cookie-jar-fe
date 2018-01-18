import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { LoginService } from '../login.service';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
  animations: [fadeInAnimation]
})
export class LogoutComponent implements OnInit {

  loginForm: NgForm;
  successMessage: string;
  errorMessage: string;
  user: any;

  constructor(
    private loginService: LoginService,
    public dialogRef: MatDialogRef<LogoutComponent>
  ) { }

  logoutUser() {
    localStorage.clear();
    this.loginService.logoutUser('login')
      .subscribe(
      result => this.successMessage = 'Logout successful',
      error => this.errorMessage = <any>error,
    );
    this.dialogRef.afterClosed()
      .subscribe(
      result => {
        location.reload();
      });
  }

  ngOnInit() {
  }

}
