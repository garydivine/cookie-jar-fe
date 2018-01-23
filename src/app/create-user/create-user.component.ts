import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { fadeInAnimation } from '../animations/fade-in.animation';
import { UserService } from '../user.service';
import { LoginService } from '../login.service';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  animations: [fadeInAnimation]
})
export class CreateUserComponent implements OnInit {

  userForm: NgForm;
  successMessage: string;
  errorMessage: string;
  user: any;
  loginInfo: any;

  @Output() loginRequestSubmitted = new EventEmitter();

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    public dialogRef: MatDialogRef<CreateUserComponent>
  ) { }

  createUser(userForm: NgForm) {
    this.errorMessage = '';
    if (userForm.value.password !== userForm.value.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
    } else {
    this.userService.createUser('create', userForm.value)
      .subscribe(
      user => {
        this.dialogRef.close();
        localStorage.setItem('user', JSON.stringify(user));
      },
      error => this.errorMessage = <any>error);
    this.loginInfo = {
      'user' : this.user.username,
      'password' : this.user.password
    };
    this.loginService.loginUser('login', this.loginInfo)
      .subscribe(
      user => {
        localStorage.setItem('user', JSON.stringify(user));
      },
      error => this.errorMessage = <any>error);
    this.dialogRef.afterClosed()
      .subscribe(
      result => {
        location.reload();
      });
    }
  }

  afterClosed() {
    this.ngOnInit();
  }

  ngOnInit() {
  }

}
