import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { LoginService } from '../login.service';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [fadeInAnimation]
})
export class LoginComponent implements OnInit {

  loginForm: NgForm;
  successMessage: string;
  errorMessage: string;
  user: any;

  @Output() loginRequestSubmitted = new EventEmitter();

  constructor(
    private loginService: LoginService,
    public dialogRef: MatDialogRef<LoginComponent>
  ) { }

  loginUser(loginForm: NgForm) {
    this.errorMessage = '';
    this.loginService.loginUser('login', loginForm.value)
      .subscribe(
      user => {
        this.dialogRef.close();
        localStorage.setItem('user', JSON.stringify(user));
      },
      error => this.errorMessage = <any>error);
    this.dialogRef.afterClosed()
      .subscribe(
      result => {
        location.reload();
      });
  }

  afterClosed() {
    this.ngOnInit();
  }

  ngOnInit() {
  }

}
